import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/IslamicReminder.css';

const reminders = [
    "اللهم صل وسلم وبارك على نبينا محمد",
    "صلوا على الحبيب المصطفى ﷺ",
    "إن الله وملائكته يصلون على النبي يا أيها الذين آمنوا صلوا عليه وسلموا تسليما",
    "اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم",
    "سبحان الله وبحمده، سبحان الله العظيم",
    "لا إله إلا الله محمد رسول الله",
    "أكثروا من الصلاة على النبي فإنها تُكفى بها الهموم وتُغفر بها الذنوب",
    "ﷺ محمد ﷺ",
    "اللهم احشرنا في زمرة النبي المصطفى ﷺ",
    "يا رب صل وسلم دائماً أبداً على حبيبك خير الخلق كلهم"
];

const IslamicReminder = () => {
    const location = useLocation();
    const [reminder, setReminder] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Pick a random reminder
        const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];
        setReminder(randomReminder);

        // Show the reminder
        setVisible(true);

        // Hide after 5 seconds
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [location.pathname]); // Trigger specifically on route change

    return (
        <div className={`islamic-reminder-container ${visible ? 'show' : ''}`}>
            <div className="islamic-content">
                <span className="islamic-icon">🕌</span>
                <p className="islamic-text">{reminder}</p>
                <span className="islamic-decoration">✨</span>
            </div>
        </div>
    );
};

export default IslamicReminder;
