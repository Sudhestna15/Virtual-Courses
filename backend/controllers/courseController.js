import Course from "../models/courseModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import Lecture from "../models/lectureModel.js"
import User from "../models/userModel.js"


export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body
        if (!title || !category) {
            return res.status(400).json({ message: "title or Category is required" })
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({ message: `CreateCourse error ${error}` })
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lecture reviews")
        if (!courses) {
            return res.status(400).json({ message: "Course is not found" })
        } return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `failed to find isPublished Courses ${error}` })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.user
        const courses = await Course.find({ creator: userId }).populate("enrolled", "name email");
        if (!courses) {
            return res.status(400).json({ message: "Course is not found" })
        } return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `failed to find Creator Courses ${error}` })
    }
}


export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, subTitle, description, category, level, isPublished, price } = req.body
        let thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: "Course is not found" })
        }
        const updateData = { title, subTitle, description, category, level, isPublished, price, thumbnail }
        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({ message: `failed to find Edit Courses  ${error}` })
    }
}


export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId).populate("lecture")
        if (!course) {
            return res.status(400).json({ message: "Course is not found" })
        }
        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({ message: `failed to get Course by id  ${error}` })
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course is not found" });
        }
        await Course.findByIdAndDelete(courseId);
        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );

        return res.status(200).json({ message: "Course removed and users updated" });
    } catch (error) {
        return res.status(500).json({ message: `failed to delete Course by id ${error}` });
    }
};




export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body
        const { courseId } = req.params
        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "lectureTitle is required" })
        }
        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId)


        if (course) {
            course.lecture.push(lecture._id)
        }
        await course.save()
        await course.populate("lecture")
        return res.status(201).json({ lecture, course })
    } catch (error) {
        return res.status(500).json({ message: `failed to create Lecture  ${error}` })

    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId).populate("lecture")
        if (!course) {
            return res.status(404).json({ message: "Course is not found" })
        }

        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({ message: `failed to getCourseLecture  ${error}` })

    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const { isPreviewFree, lectureTitle } = req.body
        const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture is not found" })
        }
        let videoUrl
        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }
        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree

        await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({ message: `failed to edit Lecture ${error}` })

    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture is not found" })

        }
        await Course.updateOne(
            { lecture: lectureId },
            { $pull: { lecture: lectureId } }
        )

        return res.status(200).json({ message: "Lecture Removed" })
    } catch (error) {
        return res.status(500).json({ message: `failed to remove Lecture ${error}` })

    }
}


export const getcreatorById = async (req, res) => {
    try {
        const { userId } = req.user

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User id not Found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Failed to remove creator ${error}` })
    }
}


export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user.enrolledCourses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to fetch enrolled courses ${error}` });
    }
};

export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        user.enrolledCourses.push(courseId);
        await user.save();
        course.enrolled.push(userId);
        await course.save();
        return res.status(200).json({ message: "Course enrolled successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Failed to enroll course ${error}` });
    }
};
