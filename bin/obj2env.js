#!/usr/bin/env node
"use strict"

import Tilda from "tilda"
import obj2env from "obj2env"
import inquirer from "inquirer"
import Logger from "bug-killer"

const DIR_OPTS = ["d", "dir"]
new Tilda(`${__dirname}/../package.json`, {
    options: [
        {
            opts: ["o", "output"]
          , desc: "Output the content in the stdout."
          , type: Boolean
        },
        {
            opts: DIR_OPTS
          , desc: "Specify the directory where to write the .env file."
          , default: ""
        }
    ]
  , examples: [
        "obj2env PORT NODE_ENV"
      , "obj2env -o PORT=8080 NODE_ENV"
    ]
}).main(action => {
    let isInteractive = false
    const variables = action.argv.map((c, index, arr) => {
        if (c.startsWith("-") || DIR_OPTS.includes(arr[index - 1].slice(1))) { return null }
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

    inquirer.prompt(questions).then(answers => {
        if (!isInteractive) {
            for (let { name, value } of variables) {
                answers[name] = value
            }
        }
        if (action.options.output.value) {
            console.log(obj2env.envToArray(answers).join("\n"))
        } else {
            obj2env.default(answers, action.options.dir.value, err => {
                if (err) { return Logger.log(err, "error") }
                Logger.log(`Written the .env file.`)
            })
        }
    }).catch(err => {
        Logger.log(err.stack, "error")
    })
})
