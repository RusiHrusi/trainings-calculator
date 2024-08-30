import React from "react";

declare global {
    interface Process {
        type?: string;
    }

    interface Window {
        process?: Process;
        require?: NodeRequire;
    }
}

export interface GeneralErrors {
    allMoney: boolean;
    selectedAuthor: boolean;
    trainingDays: boolean;
}

export interface GeneralHelperTexts {
    allMoney: string;
    selectedAuthor: string;
    trainingDays: string;
}

export interface TrainersErrors {
    trainersSelected: boolean,
    trainingsPerTrainerSum: boolean,
}

export interface TrainersHelperTexts {
    trainersSelected: string,
    trainingsPerTrainerSum: string,
}

export interface LabelledTextFieldProps {
    label: string;
    width: string;
    inputProps?: object;
    value: string;
    onChange: (event: React.ChangeEvent<{value: unknown}>) => void;
}

export interface LabelledSelection {
    label: string;
    width: string;
    options: string[];
    value: string;
    onChange: (event: React.ChangeEvent<{value: unknown}>) => void;
}

export interface TrainingsPerTrainer {
    [key: string]: number;
}

export interface TrainerFieldProps {
    trainingsPerTrainer: TrainingsPerTrainer;
    name: string;
    inputProps: object;
    addTrainer: (name: string) => void;
    removeTrainer: (name: string) => void;
    updateTrainerTrainings: (event: React.ChangeEvent<{value: unknown}>, trainerName: string) => void;
    positioning: 'left' | 'right'
}

export interface Statistics {
    allMoney: number;
    trainingDays: number;
    clubMoney: number;
    totalTrainersMoney: number;
    payments: {
        [key: string]: number;
    };
    trainingsPerTrainer: {
        [key: string]: number;
    };
}

export interface TrainersComponentData {
    trainingsPerTrainer: TrainingsPerTrainer;
    addTrainer: (name: string) => void;
    removeTrainer: (name: string) => void;
    updateTrainerTrainings: (event: React.ChangeEvent<{value: unknown}>, trainerName: string) => void;
    trainersErrors: TrainersErrors;
    trainersHelperTexts: TrainersHelperTexts;
    trainersPopoverId: string | undefined;
    trainersPopoverOpen: boolean;
    trainersPopover: HTMLElement | null;
    handlePopoversClose: (event: React.MouseEvent<HTMLElement>) => void;
}

