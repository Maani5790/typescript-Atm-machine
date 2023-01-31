#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";

const runAnimation = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    })
};

async function welcome() {
    let animation = chalkAnimation.rainbow("Welcome to ATM Machine:");
    await runAnimation();

    animation.stop();

    myCard();
};

await welcome();

async function myCard() {

    type Input = {
        userId: string;
        userPin: number;
    }

    const userInput: Input = await inquirer.prompt([
        {
            name: "userId",
            type: "input",
            message: "Enter Your ID: ",
            validate: (answer) => {
                if (answer.length < 4) {
                    return "Please Enter Min 4 Digits In Your User ID"
                }
                return true;
            }
        },
        {
            name: "userPin",
            type: "password",
            message: "Enter Your PIN: ",
            validate: (answer) => {
                if (isNaN(answer) && answer.length < 4) {
                    return "Please Enter A Number & Min 4 Digits";
                }
                else if (isNaN(answer)) {
                    return "Please Enter A Number";
                }
                else if (answer.length < 4) {
                    return "Please Enter Min 4 Digits";
                }
                return true;
            }
        }
    ]);

    const userData = {
        userId: userInput.userId,
        userPin: userInput.userPin,
    };

    return await startAgain(userData.userId, userData.userPin);
};

async function myATM() {

    const atm: { transactionType: string, amount: number } = await inquirer.prompt([
        {
            name: "transactionType",
            type: "list",
            message: "Select Your Transaction: \n",
            choices: [
                "View Balance",
                "Deposit",
                "Withdrawal"
            ],
        },
        {
            name: "amount",
            type: "list",
            message: "Select Your Amount: \n",
            choices: [
                1000,
                5000,
                10000,
                20000,
                50000
            ],
            when(answers) {
                return answers.transactionType == "Withdrawal"
            },
        },
        {
            name: "amount",
            type: "number",
            message: "Enter Your Amount: \n",
            when(answers) {
                return answers.transactionType == "Deposit"
            },
            validate: (answer) => {
                if (isNaN(answer)) {
                    return "Please Enter A Number";
                }
                return true;
            }
        }
    ]);

    return await atmCalculation(atm.amount, atm.transactionType);

};

let balance: number = 100000;

const atmCalculation = async (amount: number, transactionType: string) => {

    switch (transactionType) {
        case "View Balance":
            console.log(chalk.cyan(`Your Balance: ${balance}`));
            break;
        case "Withdrawal":
            if (balance < amount) {
                console.log(chalk.red('Sorry Your Balance Is Less Than Your Amount!'));
                break;
            } else {
                balance -= amount;
                console.log(chalk.cyan(`Your Withdrawal ${amount}`));
            }
            break;
        case "Deposit":
            balance += amount;
            console.log(chalk.cyan(`Your Deposit ${amount}`));
            break;
        default:
            return;
    };

};

async function startAgain(userId: string, userPin: number) {
    do {
        if (userId && userPin) {
            if (balance === 1000) {
                console.log(chalk.red(`Sorry, You Balance Is Rs.${balance}!`));
                break;
            } else {
                await myATM();
            }
        };

        var againCal = await inquirer.prompt({
            type: "input",
            name: "restart",
            message: "Do you want Transaction ? Press y or n: "
        });

    } while (againCal.restart === 'y' || againCal.restart === 'Y' || againCal.restart === 'yes' || againCal.restart === 'Yes' || againCal.restart === 'YES');
};