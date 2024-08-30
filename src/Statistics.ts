import {format} from 'date-fns';

import {Statistics, TrainingsPerTrainer} from './global';
import {isElectron} from './utils';

export const calcStatistics = (
    allMoney: number,
    trainingDays: number,
    trainingsPerTrainer: {
        [key: string]: number;
    },
): Statistics => {
    let clubMoney = allMoney / 2 - ((allMoney / 2) % 10) + (allMoney % 10);
    let trainersMoney = allMoney / 2 - ((allMoney / 2) % 10);

    const x = Object.values(trainingsPerTrainer).reduce((acc, value) => acc + value, 0);

    if (x !== trainingDays * 2) {
        throw new Error('Training days does not match the sum of peoples trainings count.');
    }

    const moneyPerTraining = trainersMoney / x;

    const trainersMoneyMap: {[key: string]: number} = {};

    Object.keys(trainingsPerTrainer).forEach((t) => {
        trainersMoneyMap[t] = trainingsPerTrainer[t] * moneyPerTraining;
    });

    let surplusSum = 0;

    Object.keys(trainersMoneyMap).forEach((t) => {
        surplusSum += trainersMoneyMap[t] % 10;
        trainersMoneyMap[t] = trainersMoneyMap[t] - (trainersMoneyMap[t] % 10);
    });

    if (!(surplusSum === 10 || surplusSum === 0)) {
        throw new Error('Invalid surplus sum from trainers money.');
    }

    clubMoney += surplusSum;

    return {
        allMoney,
        trainingDays,
        clubMoney,
        totalTrainersMoney: Object.values(trainersMoneyMap).reduce((acc, value) => acc + value, 0),
        payments: trainersMoneyMap,
        trainingsPerTrainer,
    };
};

const generateExportText = (userName: string, statistics: Statistics) => {
    const now = new Date();
    const formattedDate = format(now, 'MM/dd/yyyy HH:mm:ss');

    const capitalizedUsername = userName.charAt(0).toUpperCase() + userName.slice(1);

    let exportText = `Експорт генериран от: ${capitalizedUsername}\n`;
    exportText += `Дата и час: ${formattedDate}\n`;
    exportText += `Пари от тренировки: ${statistics.allMoney}лв.\n`;
    exportText += `Тренировъчни дни: ${statistics.trainingDays}\n`;
    exportText += `Пари за клуба: ${statistics.clubMoney}лв.\n`;
    exportText += `Пари общо за треньори: ${statistics.totalTrainersMoney}лв.\n`;
    exportText += `Плащания:\n`;

    for (const trainer in statistics.payments) {
        const amount = statistics.payments[trainer];
        const trainingsCount = statistics.trainingsPerTrainer[trainer] || 0;
        const capitalizedTrainer = trainer.charAt(0).toUpperCase() + trainer.slice(1);
        exportText += ` - ${capitalizedTrainer}: ${amount}лв., (брой тренировки: ${trainingsCount})\n`;
    }

    return exportText;
};

export const calculateAndGenerateExport = async (
    allMoney: number,
    trainingDays: number,
    trainingsPerTrainer: TrainingsPerTrainer,
    username: string,
) => {
    if (isElectron()) {
        const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
        console.log(statistics);
        const exportText = generateExportText(username, statistics);

        const datetime = new Date()
            .toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
            .replace(/\//g, '-');
        const fileName = `Export_${username}_${datetime}`;
        const {ipcRenderer} = window.require('electron');

        ipcRenderer.send('write-to-file', {fileName, content: exportText});
    } else {
        console.log('Not running in Electron environment');
        const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
        console.log(statistics);
    }
};