# SSPE

> API for <a href="https://github.com/harvic3/sspe-web-cli">sspe-web-cli</a> project for process text files with numbers in seven-segment format with web sockets. 

This API is a version based of previous CLI <a href="https://github.com/harvic3/sspe-project" >sspe-project.</a>

```console
$ sspe showme
executing with EXAMPLE file... ✏️
File data:
 _       _   _   _       _   _   _   _       _
  |   | |_|   | |_| |_| |_  |_| |_| |_|   | |_|
  |   | |_|   |   |   |  _| |_|   | |_|   |   |

String number:
718794589819
time-process: 2.896ms
```

## Environment

> This application was made for the NodeJs runtime environment wit web sockets.

## Installation

- Clone the repository
- Open your favorite terminal and go to the project root directory and Run the following commands:

```console
npm install
```

```console
npm run start
```

## Plus -> machine learning (is experimental)

> Use a neural network (LSTM) to process the text files and throw a string with the result equivalent to the number contained in seven-segment format within the file.

> The neural network can be trained, you can create data for the training too and process files with the last training done.

## Test

> Part of the code of this application is covered by unit tests and the idea is to add the missing ones as they are finished.

- Execute tests

```console
npm run test
```

## Usage

For use you must download the project <a href="https://github.com/harvic3/sspe-web-cli">sspe-web-cli.</a> developed in Vue Js.

- Get help

```console
sspe hi
```

- Run process with example file

```console
sspe showme
```

- Create a file with seven-segments format

```console
sspe create --name theFileName --number 654123
```

- List the created files

```console
sspe list
```

- Select a local file for process

```console
sspe select --name Foo.dat
```

- Add data for train the neural network

```console
sspe ml --add 654123 OR sspe m --add auto
```

- Training the neural network

```console
sspe ml --iter 25000 OR sspe ml
```

- Select a local file for process with Neural network

```console
sspe ml --path D:/Test/Foo.txt
```

## File Structure

```
root
|_src
| |__lib // Contains the business logic
| |__utils // Contains utilities to support business logic
|__test // Contains the unit tests
```
