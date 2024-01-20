require('dotenv').config();
const mongoose = require('mongoose')

console.log('Connecting to MongoDB')
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?:\d{2}-\d{6,}|\d{3}-\d{5,})$/.test(v)
      },
      message: props => `${props.value} is not a valid number!`
    }
  },
})

personSchema.pre('save', function(next) {
  console.log('attempting to save :', this)
  next()
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person', personSchema)
