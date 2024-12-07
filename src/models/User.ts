import { Schema, ObjectId, model, type Document } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    friends: ObjectId[],
    thoughts: ObjectId[]
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please fill a valid email address']
        },
        friends: [
            {
            type: Schema.Types.ObjectId,
            ref: 'User',
            },
        ],
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
            },
        ]
    },
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length
});

const User = model<IUser>('User', userSchema);

export default User;
