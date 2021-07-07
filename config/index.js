module.exports={
DB:process.env.MONGOLAB_URI ||"mongodb+srv://AK:123@cluster0.ionhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
port: process.env.PORT || 3006,
JWT_Token_Secret:process.env.JWT_Token_Secret||"token",
JWT_Token_ExpireIn:process.env.JWT_Token_ExpireIn||'1h',
JWT_RefreshToken_Secret:process.env.JWT_RefreshToken_Secret||"refresh",
JWT_RefreshToken_ExpireIn:process.env.JWT_Token_ExpireIn||'30 days'



}