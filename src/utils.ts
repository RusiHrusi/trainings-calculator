export const TrainerNames: string[] = ['Алекс', 'Йоан', 'Калоян', 'Кико', 'Марио', 'Пеца', 'Рус', 'Стела'];

export const isElectron = () => typeof window !== 'undefined' && window.process && window.process.type === 'renderer';

export const handleKeyPressNumbersOnly = (event: React.KeyboardEvent) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
};

export const fontHeader = `"Roboto","Helvetica","Arial",sans-serif`;