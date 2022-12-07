import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const schema = yup.object().shape({
    user: yup
    .string()
    .required("İsim-Soyisim Gerekli")
    .max(45,"İsim-Soyisim Çok Uzun"),

    email: yup
    .string()
    .email("Mail Fortmati Uygun Degil")
    .required("e-mail gerekli"),

    password: yup
    .string()
    .required("Sifre Gerekli")
    .min(8,"Şifre 8 Karakterden Uzun Olmalı")
    .max(20,"Şifre 20 Karakterden Fazla Olamaz"),
    
    agree: yup.mixed().oneOf([true], "Tüm Veriler Tamamlanmalı")

  });

  function Form() {
    const [form, setForm] = useState({
      user: "",
      email: "",
      agree: false,
      password: ""
    });
    const [errors, setErrors] = useState({
      user: "",
      star: "",
      agree: "",
      password: ""
    });
    const [disabled, setDisabled] = useState(true);
    const [userId, setUserId] = useState("");
  
    useEffect(() => {
      schema.isValid(form).then((valid) => setDisabled(!valid));
    }, [form]);
  
    const checkFormErrors = (name, value) => {
      yup
        .reach(schema, name)
        .validate(value)
        .then(() => {
          setErrors({
            ...errors,
            [name]: ""
          });
        })
        .catch((err) => {
          setErrors({
            ...errors,
            [name]: err.errors[0]
          });
        });
    };
  
    const handleChange = (event) => {
      const { checked, name, value, type } = event.target;
      const valueToUse = type === "checkbox" ? checked : value;
      checkFormErrors(name, valueToUse);
  
      setForm({
        ...form,
        [name]: valueToUse
      });
    };
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const newUser = {
        user: form.user,
        email: form.email,
        agree: form.agree,
        password: form.password
      };
  
      axios
        .post("https://reqres.in/api/user", newUser)
        .then((res) => {
          setUserId(res.data.id);
  
          setForm({
            user: "",
            star: "",
            agree: false,
            password: ""
          });
        })
        .catch((err) => {
          debugger;
        });
    };
  
    return (
      <div className="App">
        <div style={{ color: "red" }}>
          <div>{errors.user}</div>
          <div>{errors.star}</div>
          <div>{errors.password}</div>
          <div>{errors.agree}</div>
        </div>
        <form onSubmit={handleSubmit}>

          <p>
            <label htmlFor="user">İsim-Soyisim: </label>
            <input
              type="text"
              id="user"
              name="user"
              value={form.user}
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </p>

          <p>
              <label htmlFor="password">Sifre: </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.sifre}
                placeholder="Sifre Giriniz"
                onChange={handleChange}
              />
          </p>

          <p>
              <label htmlFor="email">e-Mail: </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                placeholder="email Giriniz"
                onChange={handleChange}
              />
          </p>

          <p>
            <label htmlFor="giveaway">Kullanım Sartları Kabul: </label>
            <input
              type="checkbox"
              id="giveaway"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
          </p>
          <p>
            <input type="submit" disabled={disabled} />
          </p>
        </form>
      </div>
    );
  }

export default Form;
