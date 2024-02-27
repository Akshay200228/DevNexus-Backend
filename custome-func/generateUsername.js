export const generateUsername = (name, email) => {
    // Extract the first part of the email before the @ symbol
    const emailUsername = email.split('@')[0];

    // Replace non-alphanumeric characters in the name with underscores
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');

    // Concatenate the sanitized name with the email username and add a random suffix
    let username = `${sanitizedName}_${emailUsername}-${Math.floor(Math.random() * 1000)}`;

    // Ensure the username length is between 8 and 20 characters
    if (username.length < 8) {
        // Add random characters to the end of the username to meet the minimum length
        while (username.length < 8) {
            username += Math.random().toString(36).charAt(2);
        }
    } else if (username.length > 20) {
        // Trim the username if it exceeds the maximum length
        username = username.slice(0, 20);
    }

    return username;
};
