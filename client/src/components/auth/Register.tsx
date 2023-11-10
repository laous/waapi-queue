import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewAccount } from '../../api/services/auth.service';
import { Link, useNavigate } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Name is too short' }),
  email: z.string().email(),
  password: z.string().min(6, { message: 'Password is too short' }),
});

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterSchema) => {
    await createNewAccount(data.name, data.email, data.password).catch(
      (err) => {
        if (err.response?.data?.message) {
          alert(err.response?.data?.message);
        }
      }
    );
    navigate('/');
    reset();
  };
  return (
    <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="w-auto h-10 mx-auto"
          src="https://www.waalaxy.com/wp-content/uploads/2021/09/Waalaxy-2.0-App-icon-minimalist.png"
          alt="Waapi"
        />
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                {...register('name')}
                name="name"
                type="name"
                className="p-1 caret-pink-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                {...register('email')}
                name="email"
                type="email"
                className="p-1 caret-pink-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                {...register('password')}
                id="password"
                name="password"
                type="password"
                className="p-1 caret-pink-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-1">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
            <Link
              to={'/login'}
              className="self-end text-xs text-blue-600 hover:underline dark:text-blue-500"
            >
              {'->'} Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;
