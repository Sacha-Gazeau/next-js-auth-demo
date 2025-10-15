export default function Posts() {
  return (
    <form action="">
      <label>
        Name:
        <input type="text" name="name" placeholder="Jhon Doe" />
      </label>
      <label>
        Email:
        <input type="email" name="email" placeholder="john.doe@example.com" />
      </label>
      <label>
        Password:
        <input type="password" name="name" placeholder="Password" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}
