import { Schema, ObjectId, model, type Document } from 'mongoose';

interface IThought extends Document {
    thoughtText: string,
    createdAt: string,
    username: ObjectId[],
    thoughts: ObjectId[]
}

const userSchema = new Schema<IThought>(
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
