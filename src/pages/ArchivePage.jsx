import React, { useEffect, useState } from "react";
import axios from "axios";

function ArchivePage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/archive")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>📁 Archive</h1>

      {data.map((item, index) => (
        <div key={index} style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "10px"
        }}>
          <h2>{item.live_title}</h2>
          <p>{item.live_description}</p>
          <p>📅 {item.date} ⏰ {item.time}</p>

          {item.enquete_titre && (
            <>
              <h3>📝 {item.enquete_titre}</h3>
              <p>{item.enquete_description}</p>

              {item.contenu_enquete && (
                <div style={{ marginLeft: "20px" }}>
                  <strong>❓ {item.contenu_enquete}</strong>
                </div>
              )}

              {item.contenu_reponse && (
                <div style={{ marginLeft: "40px", color: "gray" }}>
                  💬 {item.contenu_reponse}
                </div>
              )}
            </>
          )}
        </div>
      ))}

    </div>
  );
}

export default ArchivePage;