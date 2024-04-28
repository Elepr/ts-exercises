#!/usr/local/bin/ts-node

// Import of all api, we doesn't need type "pocess." after use their. Rest of code is more clear
import { readFileSync } from "fs"
import { argv, stderr, stdout, exit } from "process"

const defaultN = 10
let n = defaultN

const regex = /^-n[0-9]+$/

for (let i = 0; i < argv.length; i++) {
	if (argv[i] == "-n") {
		if (argv[i + 1] != undefined) {
			stderr.write(`Myhead: invalid number of lines: ${argv[i + 1]}\n`)
		} else {
			stderr.write(`Myhead: option requires an argument -- 'n'\n`)
		}
		exit(1)
	}
	if (regex.test(argv[i])) {
		n = parseInt(argv[i].slice(2))
		if (n == 0) exit(0)
		argv.splice(i, 1)
	}
}

/* The two first index content in argv array is, in first, the path using in shebang, and second, the path of the current prog.
We want just all index after that, cause they're own arguments in this program */
if (argv.length < 3) {
	stderr.write("myHead: error: You must pass at least one file as parameter\n")
	exit(1)
}
// If any error is catch, will return the exitCode set at 0 to the end, is a let cause if a error is throw we set this value to 1
let exitCode = 0

for (const arg of argv.slice(2)) {
	try {
		const content = readFileSync(arg, { encoding: "utf8" })
		const lines = content.split("\n")
		if (argv.length > 3) stdout.write(`==> ${arg} <==\n`)
		for (let i = 0; i < n; i++) {
			stdout.write(`${lines[i]}\n`)
		}
	} catch (error: any) {
		switch (error.code) {
			case "ENOENT":
				stderr.write(`myHead: cannot open ${arg} for reading: No such file or directory\n`)
				break
			case "EISDIR":
				stderr.write(`myHead: error reading ${arg}: Is a directory\n`)
				break
			case "EACCES":
				stderr.write(`myHead: cannot open ${arg} for reading: Permission denied\n`)
				break

			default:
				stderr.write(`myHead: ${arg}: Unknow error: ${error}\n`)
				break
		}
		exitCode = 1
	}
}

exit(exitCode)