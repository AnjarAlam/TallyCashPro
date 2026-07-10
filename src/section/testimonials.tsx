export default function Testimonials() {
  const testimonials = [
    {
      name: "Jessica F.",
      role: "HR Manager",
      quote:
        "The goal-setting feature is fantastic. I've never been more motivated to save and manage my finances.",
    },
    {
      name: "Emily S.",
      role: "Marketing Specialist",
      quote:
        "This platform is incredibly user-friendly. I've never felt more in control of my finances.",
    },
    {
      name: "Alex M.",
      role: "Teacher",
      quote:
        "The real-time tracking and personalized advice have been game-changers for my financial health.",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          What our clients say
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Their success stories reflect the impact our tools and insights have
          made in helping them achieve their financial goals.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
