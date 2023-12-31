// controllers/bookmarkController.js
import User from '../models/User.js';
import CodeComponent from '../models/CodeComponent.js';

// Bookmark a code component
export const bookmarkCodeComponent = async (req, res) => {
    const userId = req.userId;
    const codeComponentId = req.params.codeComponentId;

    try {
        console.log('Received codeComponentId:', codeComponentId);

        // Check if the code component exists
        const codeComponent = await CodeComponent.findById(codeComponentId);
        if (!codeComponent) {
            console.log('Code component not found');
            return res.status(404).json({ error: 'Code component not found' });
        }

        // Check if the user has already bookmarked the code component
        const user = await User.findById(userId);
        console.log('User bookmarks:', user.bookmarks); // Log the user's bookmarks
        const isBookmarked = user.bookmarks.includes(codeComponentId);
        if (isBookmarked) {
            console.log('Code component already bookmarked');
            return res.status(400).json({ error: 'Code component already bookmarked' });
        }

        // Add the code component to the user's bookmarks
        user.bookmarks.push(codeComponentId);
        await user.save();

        console.log('Code component bookmarked successfully');
        res.status(200).json({ message: 'Code component bookmarked successfully' });
    } catch (error) {
        console.error('Error bookmarking code component:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all users with bookmarks
export const getAllUsersWithBookmarks = async (req, res) => {
    try {
        // Use populate to get bookmarks details for each user
        const users = await User.find().populate({
            path: 'bookmarks',
            model: 'CodeComponent',
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No Users Found!' });
        }

        // Map the users to include only necessary fields
        const usersWithBookmarks = users.map((user) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            codeComponents: user.codeComponents,
            webTemplates: user.webTemplates,
            bookmarks: user.bookmarks.map((bookmark) => ({
                _id: bookmark._id,
                title: bookmark.title,
                description: bookmark.description,
                // ... (other fields)
            })),
        }));

        return res.status(200).json({ users: usersWithBookmarks });
    } catch (err) {
        console.error('Error while fetching users with bookmarks:', err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const removeBookmark = async (req, res) => {
    try {
        const userId = req.userId;
        const { codeComponentId } = req.body;

        // Remove the code component from the user's bookmarks
        await User.findByIdAndUpdate(userId, { $pull: { bookmarks: codeComponentId } });

        res.status(200).json({ message: 'Code component removed from bookmarks' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
