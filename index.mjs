#!/usr/bin/env zx

// import { $ } from "zx";

const GNOME_SHELL_VERSION_STDOUT = await $({
  quiet: true,
})`gnome-shell --version`;

if (GNOME_SHELL_VERSION_STDOUT.exitCode !== 0) {
  console.log(
    chalk.black.bgRed(`[ERROR]`),
    "gnome-shell is not installed or not in your PATH"
  );
  process.exit(1);
}

// GNOME Shell 48.0 => 48
const GNOME_SHELL_VERSION = String(GNOME_SHELL_VERSION_STDOUT).replace(
  /GNOME Shell ([0-9]+)\.[0-9]+/g,
  "$1"
);

const GNOME_EXTENSIONS_DIRECTORY =
  argv["directory"] ||
  process.env.GNOME_EXTENSIONS_DIRECTORY ||
  os.homedir() + "/.local/share/gnome-shell/extensions";

const metadataFiles = await glob([
  `${GNOME_EXTENSIONS_DIRECTORY}/**/metadata.json`,
]);

if (!metadataFiles.length) {
  console.log(chalk.black.bgRed(`[ERROR]`), "no metadata.json files found");
  if (argv["directory"]) {
    console.log(
      "Please make sure you passed the correct directory using the --directory flag"
    );
  } else if (process.env.GNOME_EXTENSIONS_DIRECTORY) {
    console.log(
      "Please make sure your extensions are installed in the given GNOME_EXTENSIONS_DIRECTORY"
    );
    console.log(`${process.env.GNOME_EXTENSIONS_DIRECTORY}`);
  } else {
    console.log(
      `Please make sure your extensions are installed in the correct directory (${
        os.homedir() + "/.local/share/gnome-shell/extensions"
      })`
    );
  }
  process.exit(1);
} else {
  console.log(`Found ${metadataFiles.length} metadata.json extension files`);
}

const dryRun =
  argv["dry-run"] || argv.dryRun || process.argv.includes("--dry-run");

if (dryRun) {
  console.log(
    chalk.black.bgYellow(`[DRY RUN]`),
    "no metadata files will be modified"
  );
}

for (const metadata of metadataFiles) {
  console.log("Processing", metadata);

  let json = {};
  try {
    json = await fs.readJson(metadata);
  } catch {
    console.log(chalk.black.bgRed(`[ERROR]`), "failed to read", metadata);
    continue;
  }

  if (!json["shell-version"]) {
    console.log(
      chalk.black.bgRed(`[ERROR]`),
      "no shell-version key found in",
      metadata,
      "skipping this file"
    );
    continue;
  }

  const extensionName = json["name"];
  const shellVersions = Array.isArray(json["shell-version"])
    ? json["shell-version"]
    : [];

  if (shellVersions.includes(GNOME_SHELL_VERSION)) {
    console.log(
      chalk.black.bgYellow(`[SKIPPED]`),
      "already contains shell version",
      GNOME_SHELL_VERSION,
      "in",
      extensionName
    );
    continue;
  }

  shellVersions.push(GNOME_SHELL_VERSION);

  json["shell-version"] = shellVersions;

  try {
    if (!dryRun) {
      await fs.writeJson(metadata, json, { spaces: 2 });
    }
  } catch {
    console.log(
      chalk.black.bgRed(`[ERROR]`),
      "failed to write metadata",
      metadata
    );
    console.log("Make sure you have write permissions to", metadata);
    continue;
  }

  console.log(
    chalk.black.bgGreen(`[UPDATED]`),
    "added shell version",
    GNOME_SHELL_VERSION,
    "to",
    extensionName,
    "in",
    metadata
  );
}

if (dryRun) {
  console.log(chalk.black.bgYellow(`[DRY RUN]`), "no files were modified");
}
