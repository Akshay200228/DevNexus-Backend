// Function to generate a random password that meets the specified criteria
export const generateRandomPassword = () => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+{}[]:;<>,.?~-';
    const numbers = '0123456789';

    const allChars = lowercaseChars + uppercaseChars + specialChars + numbers;

    let password = '';
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 0; i < 4; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password characters to ensure randomness
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
};