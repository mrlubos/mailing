import { existsSync } from "fs-extra";
import { ArgumentsCamelCase } from "yargs";
import { defaults, setConfig } from "../util/config";
import { execSync } from "child_process";
import { log } from "../util/log";
import {
  bootstrapMailingDir,
  linkEmailsDirectory,
} from "./preview/server/setup";

export type ServerArguments = ArgumentsCamelCase<{
  emailsDir?: string;
  port?: number;
  quiet?: boolean;
  subcommand?: string;
}>;

export const command = ["server [subcommand]"];

export const describe = "build and start the mailing server";

export const builder = {
  subcommand: {
    describe: "'build' or 'start', blank does both",
  },
  "emails-dir": {
    default: defaults().emailsDir,
    description: "the directory to look for your email templates in",
  },
  port: {
    default: defaults().port,
    description: "what port to start the preview server on",
  },
  quiet: {
    default: defaults().quiet,
    descriptioin: "quiet mode (don't prompt or open browser after starting)",
    boolean: true,
  },
};

export const handler = async (argv: ServerArguments) => {
  if (!argv.emailsDir) throw new Error("emailsDir option is not set");
  if (undefined === argv.port) throw new Error("port option is not set");
  if (undefined === argv.quiet) throw new Error("quiet option is not set");

  setConfig({
    emailsDir: argv.emailsDir!,
    quiet: argv.quiet!,
    port: argv.port!,
  });

  // check if emails directory already exists
  if (!existsSync("./package.json")) {
    log("No package.json found. Please run from the project root.");
    return;
  }

  await bootstrapMailingDir();
  await linkEmailsDirectory(argv.emailsDir);

  if (argv.subcommand !== "start") {
    log("building .mailing...");
    execSync("npx next build .mailing", { stdio: "inherit" });
  }

  if (argv.subcommand !== "build") {
    log("starting .mailing...");
    execSync("npx next start .mailing", { stdio: "inherit" });
  }
};
