const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // jamais renvoyé par défaut dans les requêtes
    },
  },
  { timestamps: true },
);

// Hash du mot de passe avant chaque sauvegarde
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparaison d'un mot de passe en clair avec le hash stocké
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// On ne laisse jamais fuiter le hash dans les réponses JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject(); 
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
