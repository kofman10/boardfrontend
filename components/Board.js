import React, { useState } from "react";
import { contractAddress, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit";


const Board = () => {

  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()

  const chainId = parseInt(chainIdHex)

  const gameAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

  // const { x, y } = getIndexCoordinates(index);
  const [grid, setGrid] = useState(Array(35).fill(0));
  const [selectedCell, setSelectedCell] = useState(null);
   console.log(selectedCell)
  const numRows = 7;
  const numCols = 5;

  const {
    runContractFunction: setColor,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "setColor",
    params: {
      x: 3, 
      y: 4,
      colorId:3
    },
  })



  const toggleCellColor = (cellIndex) => {
    if (selectedCell === cellIndex) {
      setSelectedCell(null);
    } else {
      setSelectedCell(cellIndex + 1);
    }
  };

  const handleColorChange = async (color) => {
    if (selectedCell !== null) {
      const newGrid = [...grid];
      await setColor({
        // onComplete:
        // onError
        onSuccess: () => console.log('success'),
        onError: (error) => console.log(error),
      })
      newGrid[selectedCell - 1] = color;
      setGrid(newGrid);
      setSelectedCell(null);
    }
  };

  // Function to convert 1D index to 2D (x, y) coordinates
  const getIndexCoordinates = (index) => {
    const x = (index % numCols) + 1;
    const y = Math.floor(index / numCols) + 1;
    return { x, y };
  };

  const [state, setState] = useState({
    x: "",
    y: "",
  });

  const {
    runContractFunction: getColor,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: gameAddress,
    functionName: "getColor",
    params: {
      x: state.x, 
      y: state.y,
    },
  })

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await getColor({
      // onComplete:
      // onError
      onSuccess: () => console.log('success'),
      onError: (error) => console.log(error),
    });
  };

  return (
    <>
    <div className="flex justify-center">
      <div className="grid grid-cols-5 grid-rows-7 gap-0 w-3/4">
        {grid.map((cellColor, index) => {
          const { x, y } = getIndexCoordinates(index);
          return (
            <div
              key={index}
              onClick={() => toggleCellColor(index)}
              className={`h-10 border border-gray-300 cursor-pointer ${
                cellColor === 2
                  ? "bg-black"
                  : cellColor === 4
                  ? "bg-yellow-500"
                  : cellColor === 3
                  ? "bg-red-500"
                  : "bg-white"
              } relative`}
            >
              {selectedCell === index && (
                <div className="absolute top-0 left-0 w-16 mt-10 z-10 bg-white border border-gray-300 rounded shadow-md">
                  <div
                    className="h-4 w-4 mx-1 bg-black cursor-pointer"
                    onClick={() => handleColorChange(2)} // Black
                  />
                  <div
                    className="h-4 w-4 mx-1 bg-yellow-500 cursor-pointer"
                    onClick={() => handleColorChange(4)} // yellow
                  />
                  <div
                    className="h-4 w-4 mx-1 bg-red-500 cursor-pointer"
                    onClick={() => handleColorChange(3)} // Red
                  />
                  <div
                    className="h-4 w-4 mx-1 bg-white border cursor-pointer"
                    onClick={() => handleColorChange(1)} // White
                  />
                </div>
              )}
              {/* Display the x, y coordinates */}
              <div className="absolute bottom-0 right-0 text-xs text-gray-500 p-1">
                {`(${x},${y})`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
                   <div className="flex flex-col mb-2 ml-10">
                      <label className="text-slate-500" htmlFor="varsity">
                        x
                      </label>
                      <input
                        value={state.x}
                        onChange={inputHandle}
                        className="p-2 border border-slate-400 mt-1 w-32 outline-0 text-slate-500 focus:border-blue-500 rounded-md"
                        type="number"
                        name="x"
                        placeholder="x"
                      />
                    </div>
                    <div className="flex flex-col mb-2 ml-10">
                      <label className="text-slate-500" htmlFor="varsity">
                        x
                      </label>
                      <input
                        value={state.y}
                        onChange={inputHandle}
                        className="p-2 border w-32 border-slate-400 mt-1 outline-0 text-slate-500 focus:border-blue-500 rounded-md"
                        type="number"
                        name="y"
                        placeholder="y"
                      />
                    </div>
                    <button className="px-3 py-2 text-lg w-40 rounded-md w-full text-white bg-blue-500" onClick={handleSubmit}>getColor</button>
    </>

  );
};

export default Board;
