/**
 * La Interfaz Command.
 * Declara el método para ejecutar una operación. La mayoría de los comandos
 * que interactúan con una API serán asíncronos.
 */
export interface ICommand {
    execute(): Promise<void>;
}
