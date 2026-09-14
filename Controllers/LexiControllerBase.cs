using Lexi.Models;
using Microsoft.AspNetCore.Mvc;

namespace Lexi.Controllers;

public abstract class LexiControllerBase : ControllerBase
{
    protected Client? CurrentClient => HttpContext.Items["Client"] as Client;

    protected bool TryGetClient(out Client client)
    {
        var c = CurrentClient;
        client = c!;
        return c != null;
    }
}
