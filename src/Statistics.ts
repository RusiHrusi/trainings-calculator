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
    const split = allMoney / 2;
    const deviation = (allMoney % 10);
    const splitDeviation = split % 10;

    let clubMoney: number;
    let trainersMoney: number;
    if (deviation === 0) {
        if (splitDeviation !== 0) {
            clubMoney = allMoney / 2 - splitDeviation;
            trainersMoney = allMoney / 2 + splitDeviation;
        } else {
            clubMoney = split - 10;
            trainersMoney = split + 10;
        }

    } else {
        const totalDeviationReduced = splitDeviation * 2;

        if (totalDeviationReduced > 10) {
            clubMoney = split - splitDeviation - 10;
            trainersMoney = split - splitDeviation + 10;

            trainersMoney += 10
            clubMoney += totalDeviationReduced - 10;
        } else {
            clubMoney = split - splitDeviation + totalDeviationReduced - 10;
            trainersMoney = split - splitDeviation + 10;
        }
    }

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

    surplusSum = Math.round(surplusSum);

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
    const formattedDate = format(now, 'dd/MM/yyyy HH:mm:ss');

    const capitalizedUsername = userName.charAt(0).toUpperCase() + userName.slice(1);

    let exportText = `Отчет генериран от: ${capitalizedUsername}\n`;
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

export const getDefaultFileName = (username: string): string => {
    const datetime = new Date()
        .toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        .replace(/\//g, '-');
    return `Отчет_${username}_${datetime}`;
}

export const calculateAndGenerateExport = (
    allMoney: number,
    trainingDays: number,
    trainingsPerTrainer: TrainingsPerTrainer,
    author: string,
) => {
    if (isElectron()) {
        const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
        console.log(statistics);
        return generateExportText(author, statistics);
    } else {
        console.log('Not running in Electron environment');
        const statistics = calcStatistics(allMoney, trainingDays, trainingsPerTrainer);
        console.log(statistics);
    }
};