const currentDir = () => {
    return process.cwd();
}

const txtFilePath = (fileName) => {
    return `${currentDir()}/src/public/txtFiles/${fileName}`;
}

const excelFilePath = (fileName) => {
    return `${currentDir()}/src/public/excelFiles/${fileName}`;
}


const dirService = {
    currentDir,
    txtFilePath,
    excelFilePath
};

export default dirService;