import {format} from 'date-fns';
import {encode} from 'utf8';

export interface Statistics {
    allMoney: number,
    trainingDays: number,
    clubMoney: number,
    totalTrainersMoney: number,
    payments: {
        [key: string]: number,
    },
    trainingsPerTrainer: {
        [key: string]: number,
    }
}

export const calcStatistics = (allMoney: number, trainingDays: number, trainingsPerTrainer: {
    [key: string]: number
}): Statistics => {
    let clubMoney = allMoney / 2 - (allMoney / 2 % 10) + (allMoney % 10)
    let trainersMoney = allMoney / 2 - (allMoney / 2 % 10)

    const x = Object.values(trainingsPerTrainer).reduce((acc, value) => acc + value, 0);

    if (x !== trainingDays * 2) {
        throw new Error('Training days does not match the sum of peoples trainings count.');
    }

    const moneyPerTraining = trainersMoney / x;

    const trainersMoneyMap: { [key: string]: number } = {};

    Object.keys(trainingsPerTrainer).forEach((t) => {
        trainersMoneyMap[t] = trainingsPerTrainer[t] * moneyPerTraining;
    })

    let surplusSum = 0;

    Object.keys(trainersMoneyMap).forEach((t) => {
        surplusSum += trainersMoneyMap[t] % 10;
        trainersMoneyMap[t] = trainersMoneyMap[t] - trainersMoneyMap[t] % 10;
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
    }
}

// NO UTF 8
// export const generateExportText = (userName: string, statistics: Statistics) => {
//     const now = new Date();
//     const formattedDate = format(now, 'MM/dd/yyyy hh:mm:ss aa');
//
//     const capitalizedUsername = userName.charAt(0).toUpperCase() + userName.slice(1);
//
//     let exportText = `Експорт генериран от: ${capitalizedUsername}\n`;
//     exportText += `Дата и час: ${formattedDate}\n`;
//     exportText += `Пари от тренировки: ${statistics.allMoney}.лв\n`;
//     exportText += `Тренировъчни дни: ${statistics.trainingDays}\n`;
//     exportText += `Пари за клуба: ${statistics.clubMoney}.лв\n`;
//     exportText += `Пари общо за треньори: ${statistics.totalTrainersMoney}.лв\n`;
//     exportText += `Плащания:\n`;
//
//     for (const trainer in statistics.payments) {
//         const amount = statistics.payments[trainer];
//         const trainingsCount = statistics.trainingsPerTrainer[trainer] || 0;
//         const capitalizedTrainer = trainer.charAt(0).toUpperCase() + trainer.slice(1);
//         exportText += ` - ${capitalizedTrainer}: ${amount}.лв, (брой тренировки: ${trainingsCount})\n`;
//     }
//
//     return exportText;
// }

export const generateExportText = (userName: string, statistics: Statistics): Buffer => {
    const now = new Date();
    const formattedDate = format(now, 'MM/dd/yyyy hh:mm:ss aa');

    const capitalizedUsername = userName.charAt(0).toUpperCase() + userName.slice(1);

    let exportBuffer = Buffer.from(`Експорт генериран от: ${capitalizedUsername}\n`, 'utf8');
    exportBuffer = Buffer.concat([exportBuffer, Buffer.from(`Дата и час: ${formattedDate}\n`, 'utf8')]);
    exportBuffer = Buffer.concat([exportBuffer, Buffer.from(`Пари от тренировки: ${statistics.allMoney}.лв\n`, 'utf8')]);
    exportBuffer = Buffer.concat([exportBuffer, Buffer.from(`Тренировъчни дни: ${statistics.trainingDays}\n`, 'utf8')]);
    exportBuffer = Buffer.concat([exportBuffer, Buffer.from(`Пари за клуба: ${statistics.clubMoney}.лв\n`, 'utf8')]);
    exportBuffer = Buffer.concat([exportBuffer, Buffer.from(`Пари общо за треньори: ${statistics.totalTrainersMoney}.лв\n`, 'utf8')]);
    exportBuffer = Buffer.concat([exportBuffer, Buffer.from(`Плащания:\n`, 'utf8')]);

    for (const trainer in statistics.payments) {
        const amount = statistics.payments[trainer];
        const trainingsCount = statistics.trainingsPerTrainer[trainer] || 0;
        const capitalizedTrainer = trainer.charAt(0).toUpperCase() + trainer.slice(1);
        exportBuffer = Buffer.concat([exportBuffer, Buffer.from(` - ${capitalizedTrainer}: ${amount}.лв, (брой тренировки: ${trainingsCount})\n`, 'utf8')]);
    }

    console.log(exportBuffer.toString());

    return exportBuffer;
}