import {Russo_One} from 'next/font/google'

export default function Main () {
    return (
        <div className='z-0'>
            <div>
                <img src="/topImg.png" alt="Image 1" className="md:w-3/5 mx-auto w-full h-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 mt-8">
                <div id="sideMenu" className="md:col-span-2">
                    サイドメニュー
                </div>
                <div id="contents" className="md:col-span-7">
                    <div className="mb-16">
                        <h1 className={`animate-tracking-in-expand relative mb-5 md:text-3xl sm:text-2xl ${russoOne.className} ml-4 text-[#000] text-3xl `}>
                            Recently News
                        </h1>
                        <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8 p-8">
                            {/*  article - start  */}
                            <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
                                <a href="#" className="group relative block h-28 overflow-hidden bg-gray-100 md:h-64">
                                    <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                </a>

                                <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                    <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">New trends in Tech</a>
                                </h2>

                                <p className="mb-8 text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                        <img src="https://images.unsplash.com/photo-1611898872015-0571a9e38375?auto=format&q=75&fit=crop&w=64" loading="lazy" alt="Photo by Brock Wegner" className="h-full w-full object-cover object-center" />
                                    </div>

                                    <div>
                                        <span className="block text-indigo-500">Mike Lane</span>
                                        <span className="block text-sm text-gray-400">July 19, 2021</span>
                                    </div>
                                    </div>

                                    <span className="rounded border px-2 py-1 text-sm text-gray-500">Article</span>
                                </div>
                                </div>
                            </div>
                            {/*  article - end  */}

                            {/*  article - start  */}
                            <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
                                <a href="#" className="group relative block h-28 overflow-hidden bg-gray-100 md:h-64">
                                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Lorenzo Herrera" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                </a>

                                <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                    <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">Working with legacy stacks</a>
                                </h2>

                                <p className="mb-8 text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                        <img src="https://images.unsplash.com/photo-1586116104126-7b8e839d5b8c?auto=format&q=75&fit=crop&w=64" loading="lazy" alt="Photo by peter bucks" className="h-full w-full object-cover object-center" />
                                    </div>

                                    <div>
                                        <span className="block text-indigo-500">Jane Jackobs</span>
                                        <span className="block text-sm text-gray-400">April 07, 2021</span>
                                    </div>
                                    </div>

                                    <span className="rounded border px-2 py-1 text-sm text-gray-500">Article</span>
                                </div>
                                </div>
                            </div>
                            {/*  article - end  */}

                            {/*  article - start  */}
                            <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
                                <a href="#" className="group relative block h-28 overflow-hidden bg-gray-100 md:h-64">
                                <img src="https://images.unsplash.com/photo-1542759564-7ccbb6ac450a?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Magicle" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                </a>

                                <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                    <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">10 best smartphones for devs</a>
                                </h2>

                                <p className="mb-8 text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                        <img src="https://images.unsplash.com/photo-1592660503155-7599a37f06a6?auto=format&q=75&fit=crop&w=64" loading="lazy" alt="Photo by Jassir Jonis" className="h-full w-full object-cover object-center" />
                                    </div>

                                    <div>
                                        <span className="block text-indigo-500">Tylor Grey</span>
                                        <span className="block text-sm text-gray-400">March 15, 2021</span>
                                    </div>
                                    </div>

                                    <span className="rounded border px-2 py-1 text-sm text-gray-500">Article</span>
                                </div>
                                </div>
                            </div>
                            {/*  article - end  */}

                            {/*  article - start  */}
                            <div className="flex flex-col overflow-hidden rounded-lg border bg-white">
                                <a href="#" className="group relative block h-28 overflow-hidden bg-gray-100 md:h-64">
                                <img src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Martin Sanchez" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                </a>

                                <div className="flex flex-1 flex-col p-4 sm:p-6">
                                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                    <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">8 High performance Notebooks</a>
                                </h2>

                                <p className="mb-8 text-gray-500">This is a section of some simple filler text, also known as placeholder text. It shares some characteristics of a real written text.</p>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&q=75&fit=crop&w=64" loading="lazy" alt="Photo by Aiony Haust" className="h-full w-full object-cover object-center" />
                                    </div>

                                    <div>
                                        <span className="block text-indigo-500">Ann Park</span>
                                        <span className="block text-sm text-gray-400">January 27, 2021</span>
                                    </div>
                                    </div>

                                    <span className="rounded border px-2 py-1 text-sm text-gray-500">Article</span>
                                </div>
                                </div>
                            </div>
                            {/*  article - end  */}
                        </div>
                    </div>
                    <div>
                        <h1 className={`animate-tracking-in-expand mb-5 md:text-3xl sm:text-2xl ${russoOne.className} ml-4 text-[#000] text-3xl `}>
                            Tech Article
                        </h1>
                        <div className="bg-white">
                            <div className="mx-auto max-w-screen-xl px-4 md:px-8">
                                <div className="grid gap-4 ">
                                {/*  article - start  */}
                                <div className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
                                    <a href="#" className="group relative hidden md:block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48">
                                    <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                    </a>

                                    <div className="flex flex-col gap-2 p-4 lg:p-6">
                                    <span className="text-sm text-gray-400">July 19, 2021</span>

                                    <h2 className="text-xl font-bold text-gray-800">
                                        <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">New trends in Tech</a>
                                    </h2>

                                    <p className="text-gray-500">This is a section of some simple filler text, also known as placeholder text.</p>

                                    <div>
                                        <a href="#" className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</a>
                                    </div>
                                    </div>
                                </div>
                                {/*  article - end  */}

                                {/*  article - start  */}
                                <div className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
                                    <a href="#" className="group relative  hidden md:block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48">
                                    <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Lorenzo Herrera" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                    </a>

                                    <div className="flex flex-col gap-2 p-4 lg:p-6">
                                    <span className="text-sm text-gray-400">April 07, 2021</span>

                                    <h2 className="text-xl font-bold text-gray-800">
                                        <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">Working with legacy stacks</a>
                                    </h2>

                                    <p className="text-gray-500">This is a section of some simple filler text, also known as placeholder text.</p>

                                    <div>
                                        <a href="#" className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</a>
                                    </div>
                                    </div>
                                </div>
                                {/*  article - end  */}

                                {/*  article - start  */}
                                <div className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
                                    <a href="#" className="group relative  hidden md:block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48">
                                    <img src="https://images.unsplash.com/photo-1542759564-7ccbb6ac450a?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Magicle" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                    </a>

                                    <div className="flex flex-col gap-2 p-4 lg:p-6">
                                    <span className="text-sm text-gray-400">March 15, 2021</span>

                                    <h2 className="text-xl font-bold text-gray-800">
                                        <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">10 best smartphones for devs</a>
                                    </h2>

                                    <p className="text-gray-500">This is a section of some simple filler text, also known as placeholder text.</p>

                                    <div>
                                        <a href="#" className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</a>
                                    </div>
                                    </div>
                                </div>
                                {/*  article - end  */}

                                {/*  article - start  */}
                                <div className="flex flex-col items-center overflow-hidden rounded-lg border md:flex-row">
                                    <a href="#" className="group relative  hidden md:block h-48 w-full shrink-0 self-start overflow-hidden bg-gray-100 md:h-full md:w-32 lg:w-48">
                                    <img src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=600" loading="lazy" alt="Photo by Martin Sanchez" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                                    </a>

                                    <div className="flex flex-col gap-2 p-4 lg:p-6">
                                    <span className="text-sm text-gray-400">January 27, 2021</span>

                                    <h2 className="text-xl font-bold text-gray-800">
                                        <a href="#" className="transition duration-100 hover:text-indigo-500 active:text-indigo-600">8 High performance Notebooks</a>
                                    </h2>

                                    <p className="text-gray-500">This is a section of some simple filler text, also known as placeholder text.</p>

                                    <div>
                                        <a href="#" className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</a>
                                    </div>
                                    </div>
                                </div>
                                {/*  article - end  */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="advertisement" className="md:col-span-3">
                    広告
                </div>
            </div>
        </div>
    )   
}

const russoOne = Russo_One({
  weight:"400",
  subsets: ['latin'],
  display: 'swap',
}); 