import type { Board, GameState, Move, Player } from '../types'

export const FEN_REGEX = /^(?:\d+,\d+:(?:b|w)(?:,\d+,\d+:(?:b|w))*)? \| (?:black|white) \| \d+:\d+ \| (?:ONGOING|DRAW|WIN_BLACK|WIN_WHITE) \| \d+$/


/**
 * Encode a GameState into a FEN-like string
 */
export function encodeFEN(state: GameState): string {
  
  const boardPart = Object.entries(state.board)
    // preserve only non-empty case 
    .filter(([_, value]) => value !== null)
    // transform: array => string
    .map(([key, value]) => `${key}:${value === 'black' ? 'b' : 'w'}`)
    .join(',')

  // add game data to FEN
  const playerPart = state.currentPlayer
  const capturedPart = `${state.captured.black}:${state.captured.white}`
  const statusPart = state.status
  const turnPart = state.turn.toString()

  return `${boardPart} | ${playerPart} | ${capturedPart} | ${statusPart} | ${turnPart}`
}

/**
 * Decode a FEN-like string into a GameState
 */
export function decodeFEN(fen: string): GameState {

  if (!FEN_REGEX.test(fen.trim())) {
    throw new Error(`Invalid FEN format: "${fen}"`)
  }

  const [boardPart, currentPlayerPart, capturedPart, statusPart, turnPart] =
    fen.trim().split(' | ')

  // 1) reconstruire le board
  const boardEntries: Board = {}
  if (boardPart) {
    const entries = boardPart.split(/,(?=\d+,\d+:[bw])/)
    for (const entry of entries) {
      const [key, code] = entry.split(':')
      boardEntries[key] = code === 'b' ? 'black' : 'white'
    }
  }

  // 2) parse captured
  const [blackCaptured, whiteCaptured] = capturedPart
    .split(':')
    .map((n) => parseInt(n, 10))

  // 3) parse turn
  const turn = parseInt(turnPart, 10)

  return {
    board: boardEntries,
    currentPlayer: currentPlayerPart as Player,
    captured: {
      black: blackCaptured,
      white: whiteCaptured,
    },
    status: statusPart as GameState['status'],
    turn,
    history: [],
  }
}

/**
 * Encode a Move into a PGN-like string
 */
export function encodeMove(move: Move): string {
  const fromPart = move.from.map(pos => `${pos.q},${pos.r}`).join(',')
  return `${move.player}|${fromPart}|${move.direction}`
}

/**
 * Decode a PGN-like string into a Move
 */
export function decodeMove(pgn: string): Move {
  const parts = pgn.trim().split('|').map(p => p.trim())

  if (parts.length !== 3) {
    throw new Error('Invalid PGN format')
  }

  const [playerStr, coordsStr, direction] = parts

  if (playerStr !== 'black' && playerStr !== 'white') {
    throw new Error('Invalid player in PGN')
  }

  const coordValues = coordsStr.split(',').map(n => parseInt(n, 10))
  if (coordValues.some(isNaN) || coordValues.length % 2 !== 0) {
    throw new Error('Invalid number in coordinates')
  }

  const from = []
  for (let i = 0; i < coordValues.length; i += 2) {
    from.push({ q: coordValues[i], r: coordValues[i + 1] })
  }

  return {
    player: playerStr,
    from,
    direction: direction as Move['direction']
  }
}
