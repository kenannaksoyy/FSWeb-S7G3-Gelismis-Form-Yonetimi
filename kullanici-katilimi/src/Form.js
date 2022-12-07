import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const schema = yup.object().shape({
    isimSoyisim: yup
    .string()
    .required("İsim-Soyisim Gerekli")
    .max(45,"İsim-Soyisim Çok Uzun"),

    email: yup
    .string()
    .email('Geçersiz e-mail adresi')
    .required("e-mail gerekli"),

    sifre: yup
    .string()
    .required("İsim-Soyisim Gerekli")
    .min(8,"Şifre 8 Karakterden Uzun Olmalı")
    .max(20,"Şifre 20 Karakterden Fazla Olamaz"),
    
    agree: yup.mixed().oneOf([true], "Tüm Veriler Tamamlanmalı")

  });

function Form() {
    const [katilimci, setKatilimci] = useState({
        isimSoyisim:"",
        email:"",
        sifre:"",
        kullanimSartlari:false
      });
    
      const [hatalar, setHatalar] = useState({
        isimSoyisim:"",
        email:"",
        sifre:"",
        kullanimSartlari:false
      })

    const [disabled, setDisabled] = useState(true);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        schema.isValid(katilimci).then((valid) => setDisabled(!valid));
    }, [katilimci]);

    const formHataKontrol = (name, value) => {
        yup
          .reach(schema, name)
          .validate(value)
          .then(() => {
            setHatalar({
              ...hatalar,
              [name]: ""
            });
          })
          .catch((err) => {
            setHatalar({
              ...hatalar,
              [name]: err.hatalar[0]
            });
          });
    };
    
    const handleChange = (event) => {
        const { checked, name, value, type } = event.target;
        const valueToUse = type === "checkbox" ? checked : value;
    
        formHataKontrol(name, valueToUse);
    
        setKatilimci({
          ...katilimci,
          [name]: valueToUse
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const newUser = {
          isimSoyisim: katilimci.isimSoyisim.trim(),
          email: katilimci.email.trim(),
          sifre: katilimci.sifre.trim(),
          kullanimSartlari: katilimci.kullanimSartlari
        };
    
        axios
          .post("https://reqres.in/api/user", newUser)
          .then((res) => {
            setUserId(res.data.id);
    
            setKatilimci({
              isimSoyisim: "",
              email: "",
              sifre: "",
              kullanimSartlari: false
            });
          })
          .catch((err) => {
            debugger;
          });
      };
    

      return (
        <div className="App">
          <div style={{ color: "red" }}>
            <div>{hatalar.isimSoyisim}</div>
            <div>{hatalar.email}</div>
            <div>{hatalar.sifre}</div>
            <div>{hatalar.kullanimSartlari}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <p>
              <label htmlFor="isimSoyisim">İsim Soyisim: </label>
              <input
                type="text"
                id="isimSoyisim"
                name="isimSoyisim"
                value={katilimci.isimSoyisim}
                placeholder="İsim-Soyisim Giriniz"
                onChange={handleChange}
              />
            </p>

            <p>
              <label htmlFor="email">e-Mail: </label>
              <input
                type="text"
                id="email"
                name="email"
                value={katilimci.email}
                placeholder="email Giriniz"
                onChange={handleChange}
              />
            </p>

            <p>
              <label htmlFor="sifre">Sifre: </label>
              <input
                type="password"
                id="sifre"
                name="sifre"
                value={katilimci.sifre}
                placeholder="Sifre Giriniz"
                onChange={handleChange}
              />
            </p>

            <p>
                <label htmlFor="kullanimSartlari">Kullanım şartları kabul ediyormusunuz </label>
                <input
                type="checkbox"
                id="kullanimSartlari"
                name="kullanimSartlari"
                checked={katilimci.kullanimSartlari}
                onChange={handleChange}
            />
            </p>
            <p>
              <input type="submit" disabled={disabled} value="Kayit Ol" />
            </p>
            <p>{userId !== "" ? <h3>Katılımcı Olusturuldu: ID {userId}</h3> : null}</p>
          </form>
        </div>
      );
    }
    

export default Form;
