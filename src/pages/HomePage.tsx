import "../styles/Home.css"

const HomePage = () => {


  return (
    <>
      <div className="page">

        <aside className="sidebar">

          <div className="search">
            <input type="text" placeholder="Setar localização" />
            <button>Buscar guinchos</button>
          </div>

          <div className="results">
            <div className="result-card">
              <span>Truck</span>
              <span>24 km</span>
            </div>

            <div className="result-card">
              <span>Truck</span>
              <span>32 km</span>
            </div>

            <div className="result-card">
              <span>Chegada</span>
              <span>28/01 15:00</span>
            </div>
          </div>

        </aside>

        <main className="map-container">
          <div id="map"></div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
