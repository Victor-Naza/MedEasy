module.exports = {
    getHome: (req, res) => {
        res.send('Bem-vindo ao MedEasy');
    },
    getData: (req, res) => {
        res.send('Dados retornados com sucesso');
    },
    auth: {
        login: (req, res) => {
            res.send('Login realizado com sucesso');
        },
        register: (req, res) => {
            res.send('Usuário registrado com sucesso');
        },
        logout: (req, res) => {
            res.send('Logout realizado com sucesso');
        }
    },
    prescription: {
        create: (req, res) => {
            res.send('Prescrição criada com sucesso');
        },
        list: (req, res) => {
            res.send('Lista de prescrições');
        }
    },
    dosage: {
        create: (req, res) => {
            res.send('Cálculo de dosagem criado com sucesso');
        },
        list: (req, res) => {
            res.send('Lista de dosagens');
        }
    }
};