/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",   // L'environnement Node.js est parfait pour des tests backend
  transform: {
    "^.+\\.tsx?$": ["ts-jest"],
  },
  collectCoverage: true,   // Active la collecte de la couverture de code
  coverageDirectory: "coverage",  // Dossier où les rapports de couverture seront générés
  coverageThreshold: {    // Optionnel: définir un seuil minimal pour la couverture
    global: {
      lines: 80,  // Exiger 80% de couverture de code au niveau global
    },
  },
  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)"   // Recherche de fichiers de test nommés comme `foo.test.ts` ou `foo.spec.ts`
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],  // Extensions de fichiers supportées
  verbose: true,  // Affiche des informations détaillées lors de l'exécution des tests
};
