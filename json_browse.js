const { isUndefined, isObject, isArray, isNull, isEmpty } = require("lodash");
const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs");
const { isNumber, isBoolean } = require("util");

const args = process.argv.slice(2);
const root_file_path = args[0];
let clipboard = "";

let g_obj_data;
let g_obj_path_str;
let g_obj_disp;
let root = [];

try {
  if (fs.existsSync(root_file_path)) {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "File:: " + root_file_path + "\nConnection:: Ok"
    );

    root = require(root_file_path);
    g_obj_data = root;
    g_obj_path_str = "root";
    g_obj_disp = "~";

    while (1) {
      const command = prompt(
        "\x1b[33m" + "cmd(" + g_obj_disp + "): " + "\x1b[0m"
      );
      const cmd_arr = command.split(" ");
      switch (cmd_arr[0]) {
        case "help":
          showHelp(cmd_arr[1]);
          break;
        case "find":
          if (cmd_arr[1] !== "" && !isUndefined(cmd_arr[1])) {
            let data = [];
            let is_error = false;
            if (cmd_arr[1] === "like") {
              if (cmd_arr[2] !== "" && !isUndefined(cmd_arr[2])) {
                data = findLike(cmd_arr[2], cmd_arr[3]);
              } else {
                is_error = true;
                console.log("\x1b[31m[✘]\x1b[0m Error:: [key] is not provided");
              }
            } else if (cmd_arr[1] === "exec") {
              if (cmd_arr[2] !== "" && !isUndefined(cmd_arr[2])) {
                data = findExec(cmd_arr[2], cmd_arr[3]);
              } else {
                is_error = true;
                console.log("\x1b[31m[✘]\x1b[0m Error:: [key] is not provided");
              }
            } else {
              data = findLike(cmd_arr[1], cmd_arr[2]);
            }
            if (!is_error) {
              console.log("Found " + data.length + " Recorde(s)");
              console.log(data);
            }
          } else {
            console.log(
              "\x1b[31m[✘]\x1b[0m Error:: Invalid Command. Type 'help print' to list 'find' commands"
            );
          }
          break;
        case "list":
          if (cmd_arr[1] === "all") {
            if (cmd_arr[2] !== "" && !isUndefined(cmd_arr[2])) {
              console.log(listAll(cmd_arr[2]));
            } else {
              console.log("\x1b[31m[✘]\x1b[0m Error:: [key] is not provided");
            }
          }
          break;
        case "print":
          let isShowed = false;
          switch (cmd_arr[1]) {
            case "keys":
              let keys = [];
              if (cmd_arr[2] === "pass") {
                console.log("\x1b[34m[•]\x1b[0m pass: true");
                keys = getKeys(true);
              } else {
                console.log("\x1b[34m[•]\x1b[0m pass: false");
                keys = getKeys(false);
              }
              console.log(keys);
              console.log(keys.length + " unique key(s).");
              break;
            case "all":
              if (cmd_arr[2] === "length") {
                isShowed = showLength("this");
              } else {
                console.log(root);
              }
              break;
            case "this":
              if (cmd_arr[2] === "length") {
                isShowed = showLength("this");
              } else {
                console.log(g_obj_data);
              }
              break;
            case "length":
              isShowed = showLength(cmd_arr[2]);
              break;
            case "file":
              console.log(root_file_path);
              break;
            case "":
              console.log(
                "\x1b[34m[•]\x1b[0m Info:: Showing " + g_obj_path_str + " value"
              );
              console.log(g_obj_data);
              break;
            case undefined:
              console.log(
                "\x1b[34m[•]\x1b[0m Info:: Showing " + g_obj_path_str + " value"
              );
              console.log(g_obj_data);
              break;
            default:
              if (!isShowed) {
                console.log("\x1b[31m[✘]\x1b[0m Error:: Invalid Command");
              }
              break;
          }
          break;
        case "save":
          console.log("Not Available yet.");
          break;
        case "set":
          if (cmd_arr[1] === "new") {
            if (cmd_arr[2] === "key") {
              if (!isUndefined(cmd_arr[4]) && !isEmpty(cmd_arr[4]))
                addNewObject(cmd_arr[3], null, true);
              else addNewObject(cmd_arr[3], null, false);
            } else if (cmd_arr[2] === "key_value") {
              addNewObject(cmd_arr[3], cmd_arr[4], false);
            }
          }
          break;
        case "copy":
          console.log("Not Available yet.");
          break;
        case "pwd":
          console.log(g_obj_path_str);
          break;
        case "cd":
          if (cmd_arr[1] === "~") {
            g_obj_data = root;
            g_obj_path_str = "root";
            g_obj_disp = "~";
          } else if (cmd_arr[1] === "..") {
            if (g_obj_path_str == "root") {
              console.log("\x1b[34m[•]\x1b[0m Info:: Already in root");
            } else {
              pathBack();
            }
          } else if (cmd_arr[1] !== "" && !isUndefined(cmd_arr[1])) {
            pathNavigate(cmd_arr[1]);
          } else {
            console.log(
              "\x1b[31m[✘]\x1b[0m Error:: Invalid Command. Type 'help cd' to list 'cd' commands"
            );
          }
          break;
        case "clear":
          process.stdout.write("\033c");
          break;
        case "version":
          const __pk_v = require("./package.json");
          console.log(__pk_v.version);
          break;
        case "about":
          const __pk_a = require("./package.json");
          console.log("Package Name : " + __pk_a.name);
          console.log("Author       : " + __pk_a.author);
          console.log("Version      : " + __pk_a.version);
          console.log("License      : " + __pk_a.license);
          console.log("Homepage     : " + __pk_a.homepage);
          console.log("Git repo     : " + __pk_a.repository.url);
          console.log("Issues       : " + __pk_a.bugs.url);
          break;
        case "exit":
          return;
        default:
          console.log("\x1b[31m[✘]\x1b[0m Error:: Invalid Command");
          break;
      }
    }
  } else {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "File:: " + root_file_path + "\nError:: No Such File"
    );
  }
} catch (error) {
  if (!isArray(root) && !isObject(root)) {
    console.log(
      "\x1b[31m%s\x1b[0m ",
      "Error:: connected file is not a JSON file"
    );
    console.log("exiting...");
  } else {
    console.log("\x1b[31m%s\x1b[0m ", error);
  }
}

function listAll(key) {
  let data_arr = [];
  if (isArray(g_obj_data)) {
    g_obj_data.forEach((res, _index) => {
      if (!isUndefined(res[key])) {
        data_arr.push(res[key]);
      }
    });
  } else {
    if (!isUndefined(g_obj_data[key])) {
      data_arr.push(g_obj_data[key]);
    }
  }
  return data_arr;
}

function findLike(key, value) {
  let data_arr = [];
  if (isArray(g_obj_data)) {
    g_obj_data.forEach((res, _index) => {
      if (!isUndefined(res[key]) && !isNull(res[key])) {
        if (res[key].toLowerCase().indexOf(value) !== -1) {
          data_arr.push(res);
        }
      }
    });
  } else {
    if (!isUndefined(g_obj_data[key]) && !isNull(g_obj_data[key])) {
      if (JSON.stringify(g_obj_data[key]).toLowerCase().indexOf(value) !== -1) {
        data_arr.push(g_obj_data[key]);
      }
    }
  }
  return data_arr;
}

function findExec(key, value) {
  let data_arr = [];
  console.log("exec");
  if (isArray(g_obj_data)) {
    g_obj_data.forEach((res, _index) => {
      if (!isUndefined(res[key]) && !isNull(res[key])) {
        if (res[key].toLowerCase() === value) {
          data_arr.push(res);
        }
      }
    });
  } else {
    if (!isUndefined(g_obj_data[key]) && !isNull(g_obj_data[key])) {
      if (JSON.stringify(g_obj_data[key]).toLowerCase() === value) {
        data_arr.push(g_obj_data[key]);
      }
    }
  }
  return data_arr;
}

function getKeys(pass) {
  const keys_arr = [];
  if (pass && !isUndefined(g_obj_data)) {
    for (let i = 0; i < g_obj_data.length; i++) {
      if (!isNull(g_obj_data[i]) && !isUndefined(g_obj_data[i])) {
        Object.keys(g_obj_data[i]).forEach((key) => {
          if (!keys_arr.includes(key)) {
            keys_arr.push(key);
          }
        });
      }
    }
  } else if (isObject(g_obj_data)) {
    Object.keys(g_obj_data).forEach((key) => {
      if (!keys_arr.includes(key)) {
        keys_arr.push(key);
      }
    });
  }
  return keys_arr;
}

function pathNavigate(cmd) {
  const obj_split = cmd.split(">");
  obj_split.every((value, index) => {
    if (index < obj_split.length && value !== " ") {
      if (
        !isNull(eval(g_obj_path_str)) &&
        Object.keys(eval(g_obj_path_str)).includes(value)
      ) {
        g_obj_disp += "> " + value;
        g_obj_path_str += "['" + value + "']";
        return true;
      } else {
        console.log("\x1b[31m[✘]\x1b[0m Error:: Path invalid");
        return false;
      }
    }
  });
  g_obj_data = eval(g_obj_path_str);
}

function pathBack() {
  let obj_split = g_obj_disp.split(">");
  obj_split.forEach((value, index) => {
    value = value.trim();
    if (index < obj_split.length - 1 && value !== " ") {
      if (value === "~") {
        g_obj_path_str = "root";
        g_obj_disp = "~";
      } else if (Object.keys(eval(g_obj_path_str)).includes(value)) {
        g_obj_disp += "> " + value;
        g_obj_path_str += "['" + value + "']";
      } else {
        console.log("\x1b[31m[✘]\x1b[0m Error:: Path invalid");
        return;
      }
    }
  });
}

function addNewObject(key, value, isWarn) {
  if (key !== "" && !isUndefined(key)) {
    let val = null;
    if (
      value !== "" &&
      !isUndefined(value) &&
      !isNull(value) &&
      value !== "null"
    ) {
      val = value;
    } else {
      if (value !== null)
        console.log(
          "\x1b[33m[?]\x1b[0m  Warning:: value not provided. Set value to null"
        );
    }
    let tmp;
    if (!isNull(val) && typeof val !== "number" && typeof value !== "boolean") {
      tmp = g_obj_path_str + "['" + key + "'] = " + '"' + val + '"';
    } else {
      tmp = g_obj_path_str + "['" + key + "'] = " + val;
    }
    eval(tmp);
    console.log("\x1b[32m[✔]\x1b[0m Success:: Set " + tmp);
    if (isWarn)
      console.log(
        '\x1b[33m[?]\x1b[0m Warning:: value provided is ignored. use "set new key_value" to set key and value both'
      );
  } else {
    console.log("\x1b[31m[✘]\x1b[0m Error:: Key value not provided.");
  }
}

function showLength(cmd) {
  switch (cmd) {
    case "this":
      if (!isNull(g_obj_data) && !isUndefined(g_obj_data)) {
        console.log(g_obj_data.length);
      } else {
        console.log("\x1b[34m[•]\x1b[0m Info:: null value. no length");
      }
      break;
    case "all":
      if (!isNull(root) && !isUndefined(root)) {
        console.log(root.length);
      } else {
        console.log("\x1b[34m[•]\x1b[0m Info:: null value. no length");
      }
      break;
    default:
      console.log(
        "\x1b[34m[•]\x1b[0m Info:: Showing " + g_obj_path_str + " value length"
      );
      if (!isNull(g_obj_data) && !isUndefined(g_obj_data)) {
        console.log(g_obj_data.length);
      } else {
        console.log("\x1b[34m[•]\x1b[0m Info:: null value. no length");
      }
      break;
  }
  return true;
}

function showHelp(key) {
  switch (key) {
    case "print":
      console.log(
        "  print                            => print value of current object(pwd)\n" +
          "  print keys                       => print all unique keys in JSON Object\n" +
          "  print keys pass                  => print all unique keys inside JSON Object Array\n" +
          "  print this                       => print value of current object(pwd)\n" +
          "  print this length                => print length of current object(pwd)\n" +
          "  print all                        => print value of root object\n" +
          "  print all length                 => print length of root object"
      );
      break;
    case "list":
      console.log(
        "  list all [key]                   => list all values in given [key]"
      );
      break;
    case "cd":
      console.log(
        "  cd ~                             => navigate to root\n" +
          "  cd [key]                         => navigate to root[key]\n" +
          "  cd [key1>key2>key3]              => navigate to root[key1][key2][key3]. (no spaces between '>')\n" +
          "  cd ..                            => navigate one key back"
      );
      break;
    case "find":
      console.log(
        "  find [key] {value}               => find all Objects with matching [key] and {value}\n" +
          "  find like [key] {value}          => find all Objects with like matching [key] and {value}\n" +
          "  find exec [key] {value}          => find all Objects with exact matching [key] and {value}"
      );
      break;
    case "save":
      break;
    case "set":
      console.log(
        " set new key [name]                => create new key in current object(pwd)\n" +
          " set new key_value [name] {?value} => create new key and set value in current object(pwd). if value not provide, then set to null"
      );
      break;
    case "pwd":
      console.log(
        "  pwd                              => print current JSON Object path"
      );
      break;
    default:
      console.log("\x1b[33m%s\x1b[0m", "print");
      console.log(
        "  print                            => print value of current object(pwd)\n" +
          "  print keys                       => print all unique keys in JSON Object\n" +
          "  print keys pass                  => print all unique keys inside JSON Object Array\n" +
          "  print this                       => print value of current object(pwd)\n" +
          "  print this length                => print length of current object(pwd)\n" +
          "  print all                        => print value of root object\n" +
          "  print all length                 => print length of root object\n"
      );
      console.log("\x1b[33m%s\x1b[0m", "list");
      console.log(
        "  list all [key]                   => list all values in given [key]\n"
      );
      console.log("\x1b[33m%s\x1b[0m", "cd");
      console.log(
        "  cd ~                             => navigate to root\n" +
          "  cd [key]                         => navigate to root[key]\n" +
          "  cd [key1>key2>key3]              => navigate to root[key1][key2][key3]. (no spaces between '>')\n" +
          "  cd ..                            => navigate one key back\n"
      );
      console.log("\x1b[33m%s\x1b[0m", "find");
      console.log(
        "  find [key] {value}               => find all Objects with matching [key] and {value}\n" +
          "  find like [key] {value}          => find all Objects with like matching [key] and {value}\n" +
          "  find exec [key] {value}          => find all Objects with exact matching [key] and {value}\n"
      );
      console.log("\x1b[33m%s\x1b[0m", "set");
      console.log(
        " set new key [name]                => create new key in current object(pwd)\n" +
          " set new key_value [name] {?value} => create new key and set value in current object(pwd). if value not provide, then set to null\n"
      );
      console.log("\x1b[33m%s\x1b[0m", "set");
      console.log(
        "  pwd                              => print current JSON Object path\n"
      );
      console.log("\x1b[33m%s\x1b[0m", "clear");
      console.log("  clear                            => Clear console\n");

      console.log("\x1b[33m%s\x1b[0m", "exit");
      console.log("  exit                             => Exit from app\n");
  }
}
