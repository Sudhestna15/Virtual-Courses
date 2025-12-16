import crypto from "crypto";

export const verifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const userId = req.userId;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId }
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolled: userId }
    });

    return res.status(200).json({ message: "Payment verified & enrolled" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};
