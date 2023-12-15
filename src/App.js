import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

const StopMarker = (props) => {
  return (
    <Marker position={props.position}>
      <Popup>{props.stopName}</Popup>
    </Marker>
  );
};

function App() {
  const cld = new Cloudinary({ cloud: { cloudName: 'dgqruvvjr' } });

  const [paradas, setParadas] = useState([]);
  const [sacarFoto, setSacarFoto] = useState(null);
  const imagenes = [];
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = () => {
    setShowAlert(true);
  };

  const funcionGuardar = (e) => {
    e.preventDefault();
    const descripcion = e.target.descripcion.value;
    const nombre = e.target.nombre.value;
    const imagenes = e.target.imagenes.files;


    // Mapa de promesas de subida de imágenes
    const cloudinaryUploadPromises = Array.from(imagenes).map((imagen) => {
      const formData = new FormData();
      formData.append('imagen', imagen);

      // Devolvemos la promesa de la subida de la imagen
      return axios.post('https://backexamenweb.vercel.app/subir', formData)
        .then((response) => response.data.secure_url);

    });


    // Resolvemos todas las promesas de subida de imágenes
    Promise.all(cloudinaryUploadPromises)
      .then((imagenesUrls) => {
        const producto = {
          descripcion: descripcion,
          nombre: nombre,
          imagenes: imagenesUrls,
        };
        console.log('Producto a crear:', producto);
        // Ahora, puedes hacer la solicitud para crear el producto
        ///return axios.post('https://backexamenweb.vercel.app/productos/', producto);
      })
    //.then((response) => {
    //  const { data } = response;
    //  const { message } = data;
    //  console.log(data);
    //})
    //.catch((error) => {
    //  console.log(error);
    //});
  };

  const sacarFotoSRC = (e) => {
    e.preventDefault();
    const url = cld.image('sample.jpg').toURL();
    setSacarFoto(url);
  }

  const numeroDeLineaYSentido = (e) => {
    e.preventDefault();
    console.log("Buscando...");
    const codLinea = document.getElementById("codLinea").value;
    const sentido = document.getElementById("sentido").value;
    axios.get(`https://backexamenweb.vercel.app/paradas/linea/${codLinea}/sentido/${sentido}`).then((response) => {
      //Limpiar los inputs del formulario
      document.getElementById("codLinea").value = "";
      document.getElementById("sentido").value = "";
      //Mostrar los datos en el mapa, este mapa ya esta creado, entonces tenemos que actualizar el MapContainer uqe hay abajo
      console.log(response.data);
      const nuevosParadas = response.data;
      const markers = nuevosParadas.map((parada) => (
        <StopMarker key={parada.id} position={[parada.lat, parada.lon]} stopName={parada.nombreParada} />
      ));
      setParadas([...paradas, ...markers]);

    }).catch((error) => { console.log(error) });

  }

  const encontrarPorDireccion = (e) => {
    e.preventDefault();
    const direccion = document.getElementById("direccion").value;
    axios.get(`https://backexamenweb.vercel.app/paradas/direccion/${direccion}`).then((response) => {
      //Limpiar los inputs del formulario
      document.getElementById("direccion").value = "";
      //Mostrar los datos en el mapa, este mapa ya esta creado, entonces tenemos que actualizar el MapContainer uqe hay abajo
      console.log(response.data);
      const nuevosParadas = response.data;
      const markers = nuevosParadas.map((parada) => (
        <StopMarker key={parada.id} position={[parada.lat, parada.lon]} stopName={parada.nombreParada} />
      ));
      setParadas([markers]);
    }).catch((error) => { console.log(error) });
  };

  const paradasPorParteDeNombre = (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreLinea").value;
    axios.get(`https://backexamenweb.vercel.app/paradas/nombre/${nombre}`).then((response) => {
      //Limpiar los inputs del formulario
      document.getElementById("nombreLinea").value = "";
      //Mostrar los datos en el mapa, este mapa ya esta creado, entonces tenemos que actualizar el MapContainer uqe hay abajo
      console.log(response.data);
      const nuevosParadas = response.data;
      const markers = nuevosParadas.map((parada) => (
        <StopMarker key={parada.id} position={[parada.lat, parada.lon]} stopName={parada.nombreParada} />
      ));
      setParadas([markers]);

    }).catch((error) => { console.log(error) });

  }

  useEffect(() => {
    document.getElementById("map");

  }
  );


  return (
    <div className="App">
      <Navbar />
      <div id="map">
        <MapContainer center={[36.719091, -4.416206]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
          />
          {/* <Marker position={position}>
                            <Popup>{articulo.nombre}</Popup>
                        </Marker> */}
          {paradas}
        </MapContainer>

      </div>

      <form>
        {/* Mediante un formulario, la aplicación permitirá seleccionar un número de línea y sentido,
mostrándose entonces en el mapa marcadores correspondientes a todas las paradas de esa línea y
sentido. */}
        <div className="form-group">
          <label htmlFor="codLinea">Código de línea</label>
          <input type="text" className="form-control" id="codLinea" placeholder="Código de línea" />
        </div>
        <div className="form-group">
          <label htmlFor="sentido">Sentido</label>
          <input type="text" className="form-control" id="sentido" placeholder="Sentido" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={numeroDeLineaYSentido}>Buscar</button>
      </form>
      <form>
        <div className="form-group">
          <label htmlFor="codLinea">Nombre de linea</label>
          <input type="text" className="form-control" id="nombreLinea" placeholder="Parte de nombre o nombre completo" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={paradasPorParteDeNombre}>Buscar</button>
      </form>

      <form>
        <div className="form-group">
          <label htmlFor="codLinea">Encontrar cerca de la direccion</label>
          <input type="text" className="form-control" id="direccion" placeholder="Direccion" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={encontrarPorDireccion}>Buscar</button>
      </form>
      <button type="submit" className="btn btn-primary" onClick={() => { setParadas([]) }}>Limpiar</button>
      <button type="submit" className="btn btn-primary" onClick={sacarFotoSRC}>Sacar foto</button>
      {sacarFoto != null && <img src={sacarFoto} alt="foto" />}
      <div>
        <div className="container-lg mt-4 mb-5">
          <div className="card" style={{ width: "100%" }}>
            <div className="card-header"></div>
            <div className="card-body">
              <h1 className="card-title Subir" style={{ textAlign: "center" }}>
                Subir Foto
              </h1>
              <form onSubmit={funcionGuardar}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    required
                  />
                </div>
                <div className="mb-4 ms-2" >
                  <label htmlFor="desc" className="form-label">
                    Descripción
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="desc"
                    name="descripcion"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="imagenes" className="form-label">
                    Imágenes (Máximo 5)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="imagenes"
                    multiple
                    required
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "2%" }}
                  type="submit"
                >
                  Subir Producto
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
