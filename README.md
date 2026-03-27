# SPYKE

Juego de deducción social para grupos. Cada ronda, todos los jugadores reciben la misma palabra secreta… excepto el espía, que recibe una palabra diferente pero relacionada. Los jugadores se turnan dando pistas, intentando demostrar que conocen la palabra sin revelarla — mientras el espía trata de pasar desapercibido.

Al final de la ronda, el grupo vota quién creen que es el espía. Si aciertan, gana el equipo. Si se equivocan, gana el espía.

## Roles

- **Inocente** — conoce la palabra del equipo. Da pistas sin delatarse.
- **Espía** — tiene una palabra distinta. Debe deducir la del equipo y no ser descubierto.
- **Impostor** *(opcional)* — no tiene ninguna palabra. Si logra adivinar la palabra del equipo antes de ser eliminado, gana.

## Cómo jugar

1. Configura la partida: número de jugadores, espías e impostores.
2. Cada jugador ve su rol y palabra en privado, pasando el dispositivo.
3. Por turnos, cada jugador da una pista de una sola palabra.
4. Al terminar la ronda, el grupo debate y vota a quién eliminar.
5. Se repite hasta que alguien gane.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animaciones)

## Correr localmente

```bash
npm install
npm run dev
```
