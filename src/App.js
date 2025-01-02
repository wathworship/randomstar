import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";  // นำเข้า SweetAlert2
import "./App.css";

// ฟังก์ชันในการสร้างดาว
const generateStars = (count) => {
  const stars = [];
  for (let i = 1; i <= count; i++) {
    const size = 20; // ขนาดดาว (เส้นผ่านศูนย์กลาง)
    const x = Math.random() * (window.innerWidth - size); // ตำแหน่ง X
    const y = Math.random() * (window.innerHeight - size); // ตำแหน่ง Y
    const color = `hsl(${Math.random() * 360}, 100%, 75%)`; // สีสุ่ม
    stars.push({ id: i, x, y, color });
  }
  return stars;
};

const App = () => {
  const [stars, setStars] = useState([]);
  const [clickedStars, setClickedStars] = useState([]);  // เก็บประวัติดาวที่ถูกคลิก
  const [isModalOpen, setIsModalOpen] = useState(false); // ควบคุมการเปิด/ปิด Modal

  // ฟังก์ชันสำหรับอัปเดตตำแหน่งของดาว
  const moveStars = () => {
    setStars((prevStars) =>
      prevStars.map((star) => {
        const moveX = Math.random() * 10 - 5; // ขยับ X (ระหว่าง -5 ถึง 5)
        const moveY = Math.random() * 10 - 5; // ขยับ Y (ระหว่าง -5 ถึง 5)
        const newX = star.x + moveX;
        const newY = star.y + moveY;

        // คำนวณให้ดาวไม่ออกนอกจอ
        const boundedX = Math.min(
          Math.max(newX, 0),
          window.innerWidth - 20
        );
        const boundedY = Math.min(
          Math.max(newY, 0),
          window.innerHeight - 20
        );

        return { ...star, x: boundedX, y: boundedY };
      })
    );
  };

  useEffect(() => {
    setStars(generateStars(500));

    // ตั้งค่า interval สำหรับเลื่อนดาวทุก 5 วินาที
    const interval = setInterval(() => {
      moveStars();
    }, 3000); // 5000ms = 5 seconds

    // ลบ interval เมื่อคอมโพเนนต์ถูกทำลาย
    return () => clearInterval(interval);
  }, []);

  const removeStar = (id) => {
    setStars((prev) => prev.filter((star) => star.id !== id));
  };

  const handleStarClick = (star) => {
    // แสดงข้อความแจ้งเตือนด้วย SweetAlert
    Swal.fire({
      title: `คุณกดดาวหมายเลข ${star.id}`,
      text: "ดาวจะหายไปหลังจากนี้!",
      icon: "info",  // ใช้ไอคอนเป็น info
      confirmButtonText: "ตกลง",
    }).then(() => {
      // เพิ่มดาวที่ถูกคลิกไปในประวัติ
      setClickedStars((prev) => [...prev, star.id]);
      removeStar(star.id);  // เมื่อคลิก "ตกลง" ดาวจะหายไป
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // เปิด/ปิด Modal
  };

  return (
    <div className="app">
      <div className="stars-container">
        {/* แสดงดาว */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.x,
              top: star.y,
              backgroundColor: star.color,
            }}
            onClick={() => handleStarClick(star)}
          >
            {star.id}
          </div>
        ))}
      </div>

      {/* ปุ่มสำหรับเปิด Modal */}
      <button className="open-modal-button" onClick={toggleModal}>
        ดูประวัติดาวที่กด
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>ประวัติของดาวที่กด</h3>
            <ul>
              {clickedStars.map((id) => (
                <li key={id}>ดาวหมายเลข {id}</li>
              ))}
            </ul>
            <button onClick={toggleModal}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
