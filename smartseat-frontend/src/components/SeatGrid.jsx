function SeatGrid({ seats, selectedSeatIds, onToggle }) {
    return (
        <div className="seat-grid" aria-label="Cinema seats">
            {seats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.seatId);
                const isUnavailable = seat.status !== 'AVAILABLE';
                return (
                    <button
                        className={`seat seat-${seat.status.toLowerCase()}${isSelected ? ' seat-selected' : ''}`}
                        key={seat.showSeatId}
                        type="button"
                        disabled={isUnavailable}
                        aria-label={`${seat.seatNumber}, ${isSelected ? 'selected' : seat.status.toLowerCase()}`}
                        onClick={() => onToggle(seat)}
                    >
                        {seat.seatNumber}
                    </button>
                );
            })}
        </div>
    );
}

export default SeatGrid;
