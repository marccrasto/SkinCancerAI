"use client";

import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

export default function Connect() {
  const team = [
    { name: "Juna Kim", role: "Project Manager", image: "/juna.png", linkedin: "https://www.linkedin.com/in/kimjuna/" },
    { name: "Marc Crasto", role: "Developer", image: "/marc.jpeg", linkedin: "https://www.linkedin.com/in/marc-crasto-95736b1b2/" },
    { name: "Diya Patel", role: "Developer", image: "/diya.png", linkedin: "https://www.linkedin.com/in/diya-patel83/" },
    { name: "Raiyan Butt", role: "Developer", image: "/raiyan.jpeg", linkedin: "https://www.linkedin.com/in/raiyanbutt/" },
    { name: "Chelsea Ye", role: "Developer", image: "/chelsea.jpeg", linkedin: "https://www.linkedin.com/in/chelsea-ye-869068304/" },
    { name: "Brian Lee", role: "Developer", image: "/brian.png", linkedin: "https://www.linkedin.com/in/taehyun-lee-08629638a/" },
    { name: "Kamal Chahal", role: "Developer", image: "/kamal.jpeg", linkedin: "https://www.linkedin.com/in/kamal-chahal-035469321/" },
  ];

  return (
    <section id="connect" className="w-full py-14 bg-white">
      <div
        className="w-full py-20 bg-cover bg-center mt-14"
        style={{ backgroundImage: "url('/ethics.png')" }}
      >
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold mb-6 text-white font-inter">Ethics Statement</h2>
          <p className="text-white text-lg leading-relaxed font-inter">
            This tool is intended for educational and informational purposes only.
            It does not provide a medical diagnosis, treatment recommendation, or
            professional healthcare advice. Users should always consult a qualified
            healthcare provider for medical concerns or decisions. We are committed
            to responsible AI development, transparency, and ensuring that this
            technology supports, rather than replaces, professional medical judgment.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mt-10 mx-auto px-6">
        <h1 className="text-3xl font-bold mb-12 text-black text-center font-inter">
          Connect with Us
        </h1>

        <div className="flex justify-start gap-14 overflow-x-auto">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={170}
                height={170}
                className="rounded-full border-2 border-gray-300 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-black font-inter">{member.name}</h3>
              <p className="text-gray-600 font-inter">{member.role}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-white bg-[#005C51] hover:bg-[#00463f] px-4 py-2 rounded-md flex items-center gap-2 justify-center font-inter"
              >
                <FaLinkedin />
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-center text-gray-500 mt-10 font-inter">
          &copy; {new Date().getFullYear()} Skin Cancer AI. Western Cyber Society(WCS). All rights reserved.
        </p>
      </div>
      
    </section>
  );
}