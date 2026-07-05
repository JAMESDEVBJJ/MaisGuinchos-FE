type Props = {
  status: string;
  driver: string;
  distance: string;
  time: string;
  price: string;
};

function HistoryGridRow({ status, driver, distance, time, price }: Props) {
  return (
    <div className="history-grid-item">
      <div className="history-grid-row-header">
        <span>{status}</span>
        <span>{driver}</span>
        <span>{distance}</span>
        <span>{time}</span>
        <span>{price}</span>
      </div>
    </div>
  );
}

export default HistoryGridRow;
