import { getUserById, User } from "./data";
const btn = document.getElementById("btn");
const input = document.getElementById("userId");
const loading = document.getElementById("loading");

class UsersService {
  @memo(1) // <- Implement This Decorator
  getUserById(id: number): Promise<User> {
    return getUserById(id);
  }
}

const usersService = new UsersService();
btn.addEventListener("click", async () => {
  loading.innerHTML = "loading";
  await usersService.getUserById(+(input as HTMLInputElement).value).then((x) => console.log(x));
  loading.innerHTML = "";
});

function memo(x: number): any {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    let cache = new Map();
    let originalMethod = descriptor.value;
    let givenId = input as HTMLInputElement;

    descriptor.value = function () {
      if (cache.has(givenId.value)) {
        let userInCache = cache.get(givenId.value);
        return new Promise((resolve) => {
          resolve(userInCache);
        });
      } else {
        return originalMethod(+givenId.value).then((u: User) => {
          cache.set(givenId.value, u);
          setTimeout(function () {
            cache.delete(givenId.value);
          }, x * 60000);
          return u;
        });
      }
    };
  };
}
