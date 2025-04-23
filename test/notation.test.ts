import {
  encodeFEN,
  decodeFEN,
  encodeMove,
  decodeMove,
} from "../src/utils/notation"
import type { GameState, Move } from "../src/types"

describe("FEN notation", () => {
  const baseState: GameState = {
    board: {
      "0,0": "black",
      "1,0": "white",
      "2,0": null, // Cette cellule n’apparaîtra pas
    },
    currentPlayer: "black",
    captured: { black: 2, white: 1 },
    status: "ONGOING",
    turn: 5,
    history: [],
  }

  it("should encode a GameState to a valid FEN string", () => {
    const fen = encodeFEN(baseState)

    // On vérifie que la string FEN est bien conforme à nos attentes
    expect(fen).toBe("0,0:b,1,0:w | black | 2:1 | ONGOING | 5")

    // Vérifie que chaque segment est bien présent
    const [board, player, captured, status, turn] = fen.split(" | ")

    expect(board).toContain("0,0:b")
    expect(board).toContain("1,0:w")
    expect(board).not.toContain("2,0") // ne doit pas contenir les cases vides

    expect(player).toBe("black")
    expect(captured).toBe("2:1")
    expect(status).toBe("ONGOING")
    expect(turn).toBe("5")
  })

  it("should decode a valid FEN string to GameState", () => {
    const fen = "0,0:b,1,0:w | black | 2:1 | ONGOING | 5"
    const state = decodeFEN(fen)

    expect(state.board["0,0"]).toBe("black")
    expect(state.board["1,0"]).toBe("white")
    expect(state.board["2,0"]).toBeUndefined()

    expect(state.currentPlayer).toBe("black")
    expect(state.captured).toEqual({ black: 2, white: 1 })
    expect(state.status).toBe("ONGOING")
    expect(state.turn).toBe(5)
  })

  it("should throw an error for an invalid FEN string", () => {
    const invalidFen = "invalid-fen-string"

    expect(() => decodeFEN(invalidFen)).toThrow(
      new Error(`Invalid FEN format: "${invalidFen}"`),
    )
  })

  it("should return the same FEN after encode-decode-encode", () => {
    const fen = encodeFEN(baseState)
    const restored = decodeFEN(fen)
    const reencoded = encodeFEN(restored)

    expect(reencoded).toBe(fen)
  })

  it("should return the same GameState after decode-encode-decode", () => {
    const fen = encodeFEN(baseState)
    const restored = decodeFEN(fen)
    const redecoded = decodeFEN(encodeFEN(restored))

    expect(redecoded).toEqual(restored)
  })
})

describe("PGN-like move notation", () => {
  const move: Move = {
    player: "white",
    from: [
      { q: 0, r: 0 },
      { q: 1, r: 0 },
    ],
    direction: "up-right",
  }

  it("should encode a Move to a PGN string", () => {
    const toEncodeMove: Move = {
      player: "white",
      from: [
        { q: 2, r: 3 },
        { q: 3, r: 3 },
      ],
      direction: "right",
    }

    const pgn = encodeMove(toEncodeMove)

    expect(typeof pgn).toBe("string")
    expect(pgn.length).toBeGreaterThan(0)

    // Vérifie le format général
    expect(pgn).toMatch(/^white\|\d+,\d+(,\d+,\d+)*\|[a-z-]+$/)

    // Vérifie les éléments spécifiques
    const [player, coords, direction] = pgn.split("|")
    expect(player).toBe("white")
    expect(direction).toBe("right")
    expect(coords).toBe("2,3,3,3")
  })

  it("should decode a valid PGN string to Move", () => {
    const pgn = "white|0,0,1,0,2,0|up"
    const decoded = decodeMove(pgn)

    expect(decoded).toEqual({
      player: "white",
      from: [
        { q: 0, r: 0 },
        { q: 1, r: 0 },
        { q: 2, r: 0 },
      ],
      direction: "up",
    })
  })

  it("should throw an error on malformed PGN string (missing parts)", () => {
    const invalidPGN = "white|0,0,1,0" // missing direction
    expect(() => decodeMove(invalidPGN)).toThrow("Invalid PGN format")
  })

  it("should throw an error if coordinates are not valid numbers", () => {
    const invalidPGN = "white|0,x,1,0|up"
    expect(() => decodeMove(invalidPGN)).toThrow(
      "Invalid number in coordinates",
    )
  })

  it('should throw an error if player are not valid string ("black" or "white")', () => {
    const invalidPGN = "johndoe|0,x,1,0|up"
    expect(() => decodeMove(invalidPGN)).toThrow("Invalid player in PGN")
  })

  it("should decode a single-piece move", () => {
    const pgn = "black|5,5|down-left"
    const decoded = decodeMove(pgn)

    expect(decoded).toEqual({
      player: "black",
      from: [{ q: 5, r: 5 }],
      direction: "down-left",
    })
  })

  it("should preserve move after encode-decode cycle", () => {
    const encoded = encodeMove(move)
    const decoded = decodeMove(encoded)
    const reencoded = encodeMove(decoded)

    expect(reencoded).toBe(encoded)
  })
})
