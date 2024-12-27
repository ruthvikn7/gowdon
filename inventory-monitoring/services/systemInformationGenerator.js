import { osInfo,baseboard } from 'systeminformation';

async function getproductID() {
  try {
    const data = await osInfo();
    // console.log(data,"data")
    return data.serial;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getBaseBoard(){
    try{
        const  boardData=await baseboard();
        // console.log(boardData)
        return boardData
    }catch(error){
        console.error("Error:",error)
        throw error
    }
}

// getBaseBoard()
export { getproductID, getBaseBoard };
