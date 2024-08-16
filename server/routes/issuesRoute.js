const router = require("express").Router();
const Issue = require("../models/issuesModel");
const Book = require("../models/booksModel");
const authMiddleware = require("../middlewares/authMiddleware");

// issue a book to patron
router.post("/issue-new-book", authMiddleware, async (req, res) => {
    try {
        /// inventory adjustment (available copies must be decremented by 1)
        await Book.findOneAndUpdate(
            { _id: req.body.book },
            { $inc: { availableCopies: -1 } }
        );

        //issue book to patron (create new issue record)
        const newIssue = new Issue(req.body);
        await newIssue.save();
        return res.send({
            success: true,
            message: "Book issued successfully",
            data: newIssue,
        });
    } catch (error) {
        return res.send({ success: false, message: error.message });
    }
});

//get issues
router.post("/get-issues", authMiddleware, async (req, res) => {
    try {
        delete req.body.userIdFromToken;
         // Add filter to exclude returned issues
         const query = { ...req.body, returnedDate: { $exists: false } };
        const issues = await Issue.find(
            req.body
        ).populate("book").populate("user").sort({issueDate: -1});
        return res.send({
            success: true,
            message: "Issues fetched successfully",
            data: issues,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });

    }
});
// return a book
router.post("/return-book", authMiddleware, async (req, res) => {
    try {
        await Book.findOneAndUpdate(
            {
                _id: req.body.book,
            },
            {
                $inc: { availableCopies: 1 }
            }
        );
        //return book (update issue record)
      // Update issue record (mark as returned)
      const updatedIssue = await Issue.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true } // Return the updated document
    ).populate("book").populate("user");

    return res.send({
        success: true,
        message: "Book returned successfully",
        data: updatedIssue, // Send the updated issue data back
    });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

// delete an issue
router.post("/delete-issue", authMiddleware, async (req, res) => {
    try {
         // Find and remove the issue record from the database
         const deletedIssue = await Issue.findOneAndDelete({ _id: req.body._id }).populate("book").populate("user");


        // Adjust the inventory (increment available copies by 1)
        await Book.findOneAndUpdate(
            { _id: req.body.book },
            { $inc: { availableCopies: 1 } }
        );

        return res.send({
            success: true,
            message: "Issue deleted successfully",
            data: deletedIssue, // Send the deleted issue data back
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

//edit an issue
router.post("/edit-issue", authMiddleware, async (req, res) => {
    try {
        await Issue.findOneAndUpdate({
            _id: req.body._id,
        },req.body);
        res.send({success: true, message: "Issue updated successfully"});
    } catch (error) {
        return res.send({ success: false, message: error.message });
    }
});



module.exports = router;