#!/usr/bin/env node
"use strict"

const Tilda = require("tilda")
    , obj2env = require("obj2env")
    , inquirer = require("inquirer")
    , Logger = require("bug-killer")
    , isThere = require("is-there")

const DIR_OPTS = ["d", "dir"]
const COMMENT_OPTS = ["c", "comment"]

const IGNORE_OPTS = [...DIR_OPTS, ...COMMENT_OPTS]

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
            opts: ["i", "interactive"]
          , desc: "Enables the interactive mode."
          , type: Boolean
          , default: false
        },
        {
            opts: DIR_OPTS
          , desc: "Specify the directory where to write the .env file."
          , default: process.cwd()
        },
        {
            opts: COMMENT_OPTS
          , desc: "Add a help text for that variable."
          , type: Array
        }
    ]
  , examples: [
        "obj2env PORT NODE_ENV"
      , "obj2env -o -c 'The port the app will use.' -c 'The node environment' PORT=8080 NODE_ENV"
    ]
}).main(action => {
    let isInteractive = action.options.interactive.value
    let comments = action.options.comment.value
    const isOutput = action.options.output.value

    Promise.resolve().then(() => {
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
            if (c.startsWith("-") || IGNORE_OPTS.includes(arr[index - 1] && arr[index - 1].slice(1))) { return null }
            const splits = c.split("=")

            const name = splits[0]
            const value = splits[1]

            isInteractive = isInteractive || !value

            return {
                name
              , value
            }
        }).filter(Boolean).map((c, i) => {
            c.comment = comments[i]
            return c
        })

        const questions = isInteractive ? variables.map((current, index) => ({
            type: "input"
          , name: current.name
          , message: `${current.name}${current.comment ? " (" + current.comment + ")" : ""} =`
          , default: current.value
        })) : []

        return inquirer.prompt(questions).then(answers => {
            if (!isInteractive) {
                for (let { name, value } of variables) {
                    answers[name] = value
                }
            }
            if (isOutput) {
                console.log(obj2env.toArray(answers).join("\n"))
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
