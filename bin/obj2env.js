#!/usr/bin/env node
"use strict"

import Tilda from "tilda"
import obj2env from "obj2env"
import inquirer from "inquirer"
import Logger from "bug-killer"
import isThere from "is-there"

const DIR_OPTS = ["d", "dir"]
new Tilda(`${__dirname}/../package.json`, {
    options: [
        {
            opts: ["o", "output"]
          , desc: "Output the content in the stdout."
          , type: Boolean
        },
        {
            opts: ["f", "force"]
          , desc: "Overrides the existing file without user confirmation."
          , type: Boolean
        },
        {
            opts: DIR_OPTS
          , desc: "Specify the directory where to write the .env file."
          , default: process.cwd()
        }
    ]
  , examples: [
        "obj2env PORT NODE_ENV"
      , "obj2env -o PORT=8080 NODE_ENV"
    ]
}).main(action => {
    let isInteractive = false
    const isOutput = action.options.output.value

    Promise.resolve().then(() => {
        debugger
        if (!isOutput && !action.options.force.is_provided && isThere(`${action.options.dir.value}/.env`)) {
            return inquirer.prompt([{
                type: "confirm"
              , name: "confirm"
              , message: "There is already an .env file in this directory. Do you want to override it?"
              , default: false
            }]).then(res => res.confirm)
        }
        return true
    }).then(cont => {
        if (!cont) {
            process.exit()
            return
        }
        const variables = action.argv.map((c, index, arr) => {
            if (c.startsWith("-") || DIR_OPTS.includes(arr[index - 1] && arr[index - 1].slice(1))) { return null }
            const splits = c.split("=")

            const name = splits[0]
            const value = splits[1]

            isInteractive = isInteractive || !value

            return {
                name
              , value
            }
        }).filter(Boolean)

        const questions = isInteractive ? variables.map(current => ({
            type: "input"
          , name: current.name
          , message: `${current.name} =`
          , default: current.value
        })) : []

        return inquirer.prompt(questions).then(answers => {
            if (!isInteractive) {
                for (let { name, value } of variables) {
                    answers[name] = value
                }
            }
            if (isOutput) {
                console.log(obj2env.envToArray(answers).join("\n"))
            } else {
                obj2env(answers, action.options.dir.value, err => {
                    if (err) { return Logger.log(err, "error") }
                    Logger.log(`Written the .env file.`)
                })
            }
        })
    }).catch(err => {
        Logger.log(err.stack, "error")
    })
})
