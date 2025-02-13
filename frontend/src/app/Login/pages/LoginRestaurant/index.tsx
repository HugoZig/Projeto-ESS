import { Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import { Link , Navigate } from 'react-router-dom';
import APIService from '../../../../shared/components/APIService/index';
import { useEffect, useState } from 'react';
import { UserContext } from '../../../../Provider';
import { useContext } from 'react';
import { FaCheck } from "react-icons/fa6";
import IconButton from "../../../../shared/components/IconButton";
import './styles.css';

export const LoginRestaurantPage = () => {
  const api = new APIService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("Erro!");
  const { user, setUserContext } = useContext<any>(UserContext);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleLogin = async(e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    };

    if(!(userData.email && userData.password)) {
      setSnackbarMessage("Todos os campos devem ser preenchidos!");
      setIsSnackbarOpen(true);
      return;
    }

    api
      .postLoginRestaurant(userData.email, userData.password)
      .then((response) => {
        const token = response.data.header;
        const restaurant = response.data.restaurant;

        setUserContext({
          id: restaurant.id,
          name: restaurant.name,
          email: restaurant.email,
          address: restaurant.address,
          cnpj: restaurant.cnpj,
        });

        api
          .postTokenRestaurant(token)
          .then((tokenResponse) => {
            setRedirectToHome(true);
          })
          .catch((tokenError) => {
            console.error("Erro ao obter token:", tokenError);
          });
      })
      .catch((error) => {
        console.error("Erro:", error);
        setSnackbarMessage("Email e/ou senha incorretos");
        setIsSnackbarOpen(true);
        return;
      });
  };

  if (redirectToHome) {
    return <Navigate to = "/restaurant/profile"/>;
  }

  return (
    <div style={{backgroundColor:"#fff13e"}}>
      <div style={{backgroundColor:"#eff1ed"}}>
        <Link to = '/*'>
          <button className="backButton">Voltar</button>
        </Link>
        <h1 className="titleLoginRestaurant">Login Restaurante</h1>
      </div>
      <div className="containerForm">
        <form className="loginForm">
          <div>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={email}
              className="formFieldLogin"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="senha"
              placeholder="Senha"
              value={password}
              className="formFieldLogin"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="containerButtonForm">
            <IconButton
              onClick={handleLogin}
              icon={FaCheck}
              color="#54b544"
              id="Login"
              text="Login"
              type="submit"
            />
            <Link to = '/restaurants/recover'>
              <button className="recPasswordButton">Esqueci a Senha</button>
            </Link>
          </div>
        </form>
      </div>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
        >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
