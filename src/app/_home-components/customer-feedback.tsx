import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function CustomerFeedback() {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      image:
        "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/home/pexels-justin-shaifer-501272-1222271.jpg",
      rating: 5,
      text: "Compré mi auto en esta página y fue una experiencia excelente. Todo súper claro y rápido.",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      image:
        "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/home/pexels-justin-shaifer-501272-1222271.jpg",
      rating: 5,
      text: "Muy buena atención al cliente y el auto que elegí estaba tal cual como en la publicación.",
    },
    {
      id: 3,
      name: "Laura Fernández",
      image:
        "https://public-images-carbucloud.s3.us-east-2.amazonaws.com/home/pexels-justin-shaifer-501272-1222271.jpg",
      rating: 4,
      text: "Encontré el auto que buscaba a muy buen precio. Lo recomiendo totalmente.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden relative">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{testimonial.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
