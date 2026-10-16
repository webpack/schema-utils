export default cli;
export type CliIO = {
  /**
   * prints a message
   */
  log: (message: string) => void;
  /**
   * prints an error
   */
  error: (message: string) => void;
};
/**
 * @typedef {object} CliIO
 * @property {(message: string) => void} log prints a message
 * @property {(message: string) => void} error prints an error
 */
/**
 * Runs the command line interface.
 * @param {string[]} args arguments without `node` and the script
 * @param {CliIO} io where the output goes
 * @returns {Promise<number>} exit code
 */
declare function cli(args: string[], io: CliIO): Promise<number>;
