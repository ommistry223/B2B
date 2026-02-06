#!/bin/bash


echo "=== Starting NuMarkdown-8B-Thinking Space ==="
echo "Starting vLLM server with optimized settings..."
# Start vLLM with HF Spaces optimizations
python3 -m vllm.entrypoints.openai.api_server \
    --model numind/NuMarkdown-8B-Thinking \
    --port 8000 \
    --host 0.0.0.0 \
    --max-model-len 20000 \
    --gpu-memory-utilization 0.95 \
    --disable-log-requests \
    --tensor-parallel-size 1 \
    --trust-remote-code > $HOME/app/vllm.log 2>&1 &

VLLM_PID=$!
echo "vLLM started with PID: $VLLM_PID"

# More aggressive waiting with health checks
echo "Waiting for vLLM server to start (this may take 5-10 minutes)..."
for i in {1..180}; do  # Wait up to 6 minutes
    if curl -s --connect-timeout 5 http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ vLLM health check passed!"
        break
    elif curl -s --connect-timeout 5 http://localhost:8000/v1/models > /dev/null 2>&1; then
        echo "✓ vLLM server is ready!"
        break
    fi
    
    # Show progress every 10 seconds
    if [ $((i % 10)) -eq 0 ]; then
        echo "Still waiting... ($i/180) - checking vLLM process"
        if ! ps -p $VLLM_PID > /dev/null; then
            echo "❌ vLLM process died! Checking logs:"
            tail -20 $HOME/app/vllm.log
            exit 1
        fi
    fi
    sleep 2
done

# Final check
if ! curl -s http://localhost:8000/v1/models > /dev/null; then
    echo "❌ vLLM server failed to start after 6 minutes!"
    echo "Last 50 lines of vLLM logs:"
    tail -50 $HOME/app/vllm.log
    exit 1
fi

echo "✅ vLLM server is ready!"
echo "=== Starting Gradio App ==="
echo "Port 7860 status before launching Gradio:"
netstat -tuln | grep :7860 || echo "Port 7860 is free"

echo "Environment check:"
echo "PORT=${PORT:-7860}"
echo "PWD=$(pwd)"
echo "USER=$(whoami)"

# Launch Gradio with explicit error handling
echo "Launching Gradio..."
echo "Checking if app.py exists:"
ls -la $HOME/app/app.py
echo "Python path:"
which python3
echo "Current directory contents:"
ls -la $HOME/app/

echo "=== Starting Gradio App ==="
echo "Running crash debug version..."
python3 $HOME/app/app.py