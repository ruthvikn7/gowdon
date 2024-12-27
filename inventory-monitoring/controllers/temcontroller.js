import Item from '../Model/itemSchema.js';


export const dyFunction =async (req,res)=>{
    try{
        console.log("rutvik")
        const { category } = req.params;
        const { search } = req.query;

        const searchTerm = new RegExp(search,'i');

        const query={
            'category.name':category,
            $or:[
                {name:{$regex:searchTerm} },
                {description:{$regex:searchTerm} },
            ],
        };

        const items = await Item.find(query);

        res.status(200).json(items);
    }catch(error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
};